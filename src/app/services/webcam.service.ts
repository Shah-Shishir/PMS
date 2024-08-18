import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Services
import { FileService } from '../core/services/file.service';
import { ProfileService } from './profile.service';
import { UiService } from '../core/services/ui.service';

// Models
import { Profile } from '../models/profile.model';

// Utils
import { PictureOption } from '../utils/enums/picture-option.enum';

// Webcam
import { WebcamImage } from 'ngx-webcam';

// Image Cropper
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Injectable({
  providedIn: 'root',
})
export class WebcamService {
  imageDataUrl!: string;
  imageFile!: File;
  croppedImageBlob!: Blob;

  fileService = inject(FileService);
  profileService = inject(ProfileService);
  uiService = inject(UiService);

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  showWebCam: boolean = true;
  showWebCamOptions: boolean = false;
  showImageCropper: boolean = false;

  constructor() {}

  triggerSnapshot(): void {
    this.trigger.next();
  }

  blobToImageFile(blob: Blob) {
    const dateNow = Date.now();
    const fileType = blob.type.split('/')[1];

    this.imageFile = new File(
      [blob],
      `${this.profileService.profile.uid}_captured_image_${dateNow}.${fileType}`,
      {
        type: blob.type,
        lastModified: dateNow,
      }
    );
  }

  async handleImage(webcamImage: WebcamImage): Promise<void> {
    this.imageDataUrl = webcamImage.imageAsDataUrl;
    this.showWebCam = false;

    const response = await fetch(this.imageDataUrl);
    const blob = await response.blob();

    this.blobToImageFile(blob);
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  openImageCropper() {
    this.showImageCropper = true;
  }

  async cropImage() {
    this.showImageCropper = false;
    this.blobToImageFile(this.croppedImageBlob);
    this.imageDataUrl = await this.fileService.blobToDataURL(
      this.croppedImageBlob
    );
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageBlob = event.blob!;
  }

  switchCamera() {
    this.showImageCropper = false;
    this.showWebCam = true;
    this.imageDataUrl = '';
  }

  async savePhoto(profile: Profile, option: string) {
    const url: string | null =
      (option === PictureOption.PROFILE_PHOTO
        ? profile.photoURL
        : profile.coverPhotoURL) || null;

    await this.profileService.uploadProfileCoverPhoto(
      this.imageFile,
      profile,
      option,
      !!url
    );
    this.closeClearDialog();
  }

  closeClearDialog() {
    this.imageDataUrl = '';
    this.imageFile = new File([], '', {
      type: '',
      lastModified: 0,
    });
    this.showWebCam = true;
    this.showWebCamOptions = this.showImageCropper = false;
    this.uiService.closeDialog(null);
  }
}
