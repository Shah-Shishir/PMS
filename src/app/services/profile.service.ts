import { Injectable, inject, model } from '@angular/core';

// Firebase
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

// Auth
import { User, getAuth } from 'firebase/auth';

// Components
import { ProfileCompleteDialogComponent } from '../features/profile/profile-complete-dialog/profile-complete-dialog.component';

// Services
import { AppService } from '../core/services/app.service';
import { FileService } from '../core/services/file.service';
import { FormService } from '../core/services/form.service';
import { UiService } from '../core/services/ui.service';

// Models
import { FormField } from '../models/formField.model';
import {
  Address,
  EducationDetails,
  WorkExperience,
  Profile,
} from '../models/profile.model';
import { ProfileInfo } from '../models/profile-info.model';
import { ProfileFeed } from '../models/profile-feed.model';

// Enums
import { Collection } from '../utils/enums/collection.enum';
import { Entity } from '../utils/enums/entity.enum';
import { PictureOption } from '../utils/enums/picture-option.enum';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  auth = getAuth();
  storage = getStorage();
  field!: FormField;

  appService = inject(AppService);
  uiService = inject(UiService);
  fileService = inject(FileService);
  formService = inject(FormService);

  profile!: Profile;
  profileInfo!: ProfileInfo;
  loadingProfile: boolean = true;
  settingProfile: boolean = false;
  savingProfileInfo: boolean = false;
  savingProfilePhoto: boolean = false;
  updatingProfilePhoto: boolean = false;
  savingCoverPhoto: boolean = false;
  updatingCoverPhoto: boolean = false;
  deletingProfile: boolean = false;
  isMyProfile: boolean = false;
  savingEducationProfession: boolean = false;

  isEditable = {
    birthday: false,
    privacy: false,
    bio: false,
    address: false,
    hobbies: false,
  };

  profiles: Profile[] = [];
  loadingProfiles: boolean = true;
  showFriends: boolean = false;

  feed: ProfileFeed = {
    id: 0,
    feeling: '',
    photos: [],
    checkIn: '',
    description: '',
    likes: {
      count: 0,
      users: [],
    },
    comments: [],
    privacyId: 1,
    createdAt: '',
    updatedAt: '',
    isExpanded: false,
  };
  savingFeed: boolean = false;
  uploadingPhotos: boolean = false;
  photosCount: number = 0;
  uploadedPhotos: any[] = [];

  updatingPrivacy: boolean = false;
  updatingFeedIndex: number = 0;

  getCurrentProfile() {
    this.loadingProfile = true;

    // Track Firebase Auth State Change
    this.auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        // Get User Profile from Fire Store
        const profileRef = doc(
          this.appService._appDB,
          Collection.PROFILES,
          user.uid
        );

        const profileSnap = await getDoc(profileRef);
        const profile = profileSnap.data() as Profile;

        this.profile = profile;

        if (!profile.displayName || !profile.genderId) {
          this.openProfileCompleteDialog(profile);
        }
      }
    });
  }

  async getProfileFromDb(userId: string) {
    this.isMyProfile = userId === this.appService.userId;

    this.loadingProfile = true;

    const profileRef = doc(this.appService._appDB, Collection.PROFILES, userId);

    const profileSnap = await getDoc(profileRef);

    this.profile = profileSnap.data() as Profile;

    if (!this.profile.workExperiences) {
      this.profile.workExperiences = [];
    }

    console.log(this.profile);

    this.loadingProfile = false;

    if (
      this.isMyProfile &&
      (!this.profile.displayName || !this.profile.genderId)
    ) {
      this.openProfileCompleteDialog(this.profile);
    }
  }

  prepareBirthdayForm() {
    this.isEditable.birthday = true;
    this.formService.prepareBirthdayForm(this.profile.dob!);
    this.field = {
      id: 4,
      isRequired: false,
      label: 'Birthday',
      name: 'dob',
    };
  }

  preparePrivacyForm() {
    this.isEditable.privacy = true;
    this.formService.preparePrivacyForm(this.profile.privacyId);
    this.field = {
      id: 10,
      isRequired: false,
      label: 'Privacy',
      name: 'privacyId',
      values: [
        {
          id: 1,
          label: 'Public',
          name: 'public',
        },
        {
          id: 2,
          label: 'Friends',
          name: 'friends',
        },
      ],
    };
  }

  openProfileCompleteDialog(profile: Profile) {
    this.uiService.openDialog(
      ProfileCompleteDialogComponent,
      {
        profile,
      },
      '350px',
      '300px'
    );
  }

  async setProfile(
    profileData: Profile,
    fromSignUp: boolean = false,
    successMessage: string = 'Profile Updated',
    fromHobbies: boolean = false
  ) {
    const profileRef = doc(
      this.appService._appDB,
      Collection.PROFILES,
      profileData.uid
    );

    this.settingProfile = true;

    await setDoc(profileRef, profileData, { merge: true })
      .then((_) => {
        this.profile = profileData;
        this.feed.privacyId = this.profile.privacyId;
        !fromSignUp && this.uiService.openSnackbar(successMessage);
      })
      .catch((_) => {
        this.uiService.openSnackbar(
          `Error during updating ${
            fromHobbies ? 'hobbies' : 'profile'
          }. Try after sometimes.`
        );
      })
      .finally(() => {
        this.settingProfile = false;
        fromSignUp && this.uiService.closeDialog(null);
      });
  }

  onPictureChange(
    event: Event,
    profile: Profile,
    pictureOption: string,
    isUpdate?: boolean
  ) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      const file: File = input.files[0];
      this.uploadProfileCoverPhoto(
        file,
        profile,
        pictureOption,
        isUpdate ?? false
      );
    }
  }

  async onUploadFeedPhotos(event: Event, isUpdate?: boolean) {
    this.uploadingPhotos = true;

    const input = event.target as HTMLInputElement;
    const fileList = input.files ?? [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (this.fileService.isFileImage(file)) {
        ++this.photosCount;
      } else {
        this.uiService.openSnackbar(
          'Please upload a valid image file',
          true,
          2000
        );
      }
    }

    if (this.photosCount > 10) {
      this.photosCount = 10;
      this.uiService.openSnackbar("You can't upload more than 10 photos");
      this.uploadingPhotos = false;
    }

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (this.fileService.isFileImage(file)) {
        if (this.uploadedPhotos.length < 10) {
          const isoDateValue = new Date().toISOString();

          // Create the file path
          let filePath = `uploads/${this.profile.uid}/feeds/${isoDateValue}:${file.name}`;

          // Get the file reference
          let fileRef = ref(this.storage, filePath);

          // Upload image to Cloud
          await uploadBytes(fileRef, file);

          // Get download URL
          const url = await getDownloadURL(fileRef);

          this.uploadedPhotos.push({
            name: `${isoDateValue}:${file.name}`,
            url,
          });
        }
      }
    }

    this.uploadingPhotos = false;
  }

  async removeFeedPhoto(index: number) {
    const removedPhoto = this.uploadedPhotos[index];

    /* Remove Locally */
    --this.photosCount;
    this.uploadedPhotos.splice(index, 1);

    /* Remove from Storage */
    const filePath: string = `uploads/${this.profile.uid}/feeds/${removedPhoto.name}`;
    const fileRef: StorageReference = ref(this.storage, filePath);
    await deleteObject(fileRef);
  }

  async publishFeed(isUpdate: boolean = false) {
    if (
      !this.feed.description &&
      !this.feed.feeling &&
      !this.uploadedPhotos.length &&
      !this.feed.checkIn
    ) {
      this.uiService.openSnackbar('Feed is empty!', true);
      return;
    }

    this.savingFeed = true;

    this.feed = {
      ...this.feed,
      id: Date.now(),
      photos: this.uploadedPhotos,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const profileRef = doc(
      this.appService._appDB,
      Collection.PROFILES,
      this.appService.userId
    );

    const profile: Profile = this.appService.returnCopy(this.profile);

    if (!profile.feeds) {
      profile.feeds = [];
    }

    profile.feeds.unshift(this.feed);

    await setDoc(profileRef, profile, { merge: true })
      .then((_) => {
        this.profile = profile;
        this.uiService.openSnackbar(
          `Feed ${isUpdate ? 'updated' : 'published'} successfully...`
        );
      })
      .catch((_) => {
        this.uiService.openSnackbar(
          `Error during ${
            isUpdate ? 'updating' : 'publishing'
          } feed. Try after sometimes.`
        );
      })
      .finally(() => {
        this.savingFeed = false;
        this.uploadedPhotos = [];
        this.photosCount = 0;
        this.feed = {
          id: 0,
          feeling: '',
          photos: [],
          checkIn: '',
          description: '',
          likes: {
            count: 0,
            users: [],
          },
          comments: [],
          privacyId: this.profile.privacyId,
          createdAt: '',
          updatedAt: '',
          isExpanded: false,
        };
      });
  }

  async updateFeedPrivacy(index: number, privacyId: number) {
    this.updatingFeedIndex = index;

    const profileRef = doc(
      this.appService._appDB,
      Collection.PROFILES,
      this.appService.userId
    );

    this.updatingPrivacy = true;

    const profile: Profile = this.appService.returnCopy(this.profile);

    profile.feeds[index].privacyId = privacyId;

    await setDoc(profileRef, profile, { merge: true })
      .then((_) => {
        this.profile = profile;
        this.uiService.openSnackbar('Privacy updated');
      })
      .catch((_) => {
        this.uiService.openSnackbar('Error during updating privacy');
      })
      .finally(() => {
        this.updatingPrivacy = false;
      });
  }

  async uploadProfileCoverPhoto(
    file: File,
    profile: Profile,
    pictureOption: string,
    isUpdate: boolean
  ): Promise<void> {
    const fileNameToDelete: string | null =
      pictureOption === PictureOption.PROFILE_PHOTO
        ? profile.photoName
        : profile.coverPhotoName;

    if (!this.fileService.isFileImage(file)) {
      this.uiService.openSnackbar(
        'Please upload a valid image file',
        true,
        2000
      );

      return;
    }

    // Using for loader
    if (pictureOption === PictureOption.PROFILE_PHOTO) {
      this.savingProfilePhoto = true;

      if (isUpdate) {
        this.updatingProfilePhoto = true;
      }
    } else {
      this.savingCoverPhoto = true;

      if (isUpdate) {
        this.updatingCoverPhoto = true;
      }
    }

    const dateValue: string = new Date().toISOString();

    // Create the file path
    let filePath = `uploads/${profile.uid}/${dateValue}:${file.name}`;

    // Get the file reference
    let fileRef = ref(this.storage, filePath);

    // Upload image to Cloud
    await uploadBytes(fileRef, file);

    // Get download URL
    const url = await getDownloadURL(fileRef);

    // Save User Profile
    pictureOption === PictureOption.PROFILE_PHOTO
      ? await this.setProfile({
          ...profile,
          photoURL: url,
          photoName: `${dateValue}:${file.name}`,
        })
      : await this.setProfile({
          ...profile,
          coverPhotoURL: url,
          coverPhotoName: `${dateValue}:${file.name}`,
        });

    // Setting Image data to show on UI
    if (pictureOption === PictureOption.PROFILE_PHOTO) {
      profile.photoURL = url;
      profile.photoName = `${dateValue}:${file.name}`;
      this.savingProfilePhoto = false;

      if (isUpdate) {
        this.updatingProfilePhoto = false;
      }

      if (fileNameToDelete) {
        this.deleteProfilePhoto(profile.uid, fileNameToDelete, false);
      }
    } else {
      profile.coverPhotoURL = url;
      profile.coverPhotoName = `${dateValue}:${file.name}`;

      this.savingCoverPhoto = false;

      if (isUpdate) {
        this.updatingCoverPhoto = false;
      }

      if (fileNameToDelete) {
        this.deleteCoverPhoto(profile.uid, fileNameToDelete, false);
      }
    }
  }

  async deleteProfilePhoto(
    userId: string,
    imageFileName: string,
    deleteCurrent: boolean = true
  ) {
    this.savingProfilePhoto = true;

    if (deleteCurrent) {
      this.profile.photoURL = this.profile.photoName = null;
      await this.setProfile(this.profile);
      this.uiService.openSnackbar('Profile photo has been removed');
    }

    const filePath: string = `uploads/${userId}/${imageFileName}`;
    const fileRef: StorageReference = ref(this.storage, filePath);
    deleteObject(fileRef);

    this.savingProfilePhoto = false;
  }

  async deleteCoverPhoto(
    userId: string,
    imageFileName: string,
    deleteCurrent: boolean = true
  ) {
    this.savingCoverPhoto = true;

    if (deleteCurrent) {
      this.profile.coverPhotoURL = this.profile.coverPhotoName = null;
      await this.setProfile(this.profile);
      this.uiService.openSnackbar('Cover photo has been removed');
    }

    const filePath: string = `uploads/${userId}/${imageFileName}`;
    const fileRef: StorageReference = ref(this.storage, filePath);
    await deleteObject(fileRef);

    this.savingCoverPhoto = false;
  }

  async getProfilesFriends(getFriends: boolean = false) {
    this.loadingProfiles = true;

    let dataCollection;

    if (getFriends) {
      const userDocRef = doc(
        this.appService._appDB,
        Collection.FRIENDS,
        this.appService.userId
      );
      dataCollection = collection(userDocRef, Collection.FRIENDS);
    } else {
      dataCollection = collection(this.appService._appDB, Collection.PROFILES);
    }

    const dataQuery = query(dataCollection, orderBy(Entity.DISPLAY_NAME));
    const dataSnap = await getDocs(dataQuery);

    this.profiles = dataSnap.docs.map((doc) => doc.data()) as Profile[];

    this.loadingProfiles = false;
  }

  async getProfileInfo() {
    const profileInfoRef = doc(
      this.appService._appDB,
      Collection.PROFILE_INFO,
      this.appService.userId
    );

    const profileInfoSnap = await getDoc(profileInfoRef);

    this.profileInfo = profileInfoSnap.data() as ProfileInfo;

    let { bio, basicInfo, educationalHistory, professionalHistory, hobbies } =
      this.profileInfo;

    if (!bio) {
      bio = '';
    }

    if (!basicInfo) {
      basicInfo = {
        address: {
          longDescription: '',
          city: '',
          state: '',
          country: '',
        },
        genderId: this.profile.genderId ?? 1,
        birthday: this.profile.dob ?? '',
        emailAddress: this.profile.email ?? '',
        phoneNumber: this.profile.phoneNumber ?? '',
      };
    }

    if (!educationalHistory) {
      educationalHistory = {
        schools: [],
        colleges: [],
        universities: [],
      };
    }

    if (!professionalHistory) {
      professionalHistory = [];
    }

    if (!hobbies) {
      hobbies = [];
    }

    this.profileInfo = {
      bio,
      basicInfo,
      educationalHistory,
      professionalHistory,
      hobbies,
    };
  }

  /* async setProfileInfo(infoData: ProfileInfo, fromSignUp: boolean = false, successMessage: string = 'Profile Info Updated') {
    const profileRef = doc(
      this.appService._appDB,
      Collection.PROFILES,
      this.appService.userId
    );

    this.savingProfileInfo = true;

    await setDoc(profileRef, infoData, { merge: true })
      .then((_) => {
        this.profileInfo = infoData;
        !fromSignUp && this.uiService.openSnackbar(successMessage);
      })
      .catch((_) => {
        this.uiService.openSnackbar('Error during update. Try after sometimes');
      })
      .finally(() => {
        this.savingProfileInfo = false;
        fromSignUp && this.uiService.closeDialog(null);
      });
  } */

  filterWithFriends() {
    this.showFriends = !this.showFriends;
    this.getProfilesFriends(this.showFriends);
  }

  hasValidAddress(address: Address): boolean {
    return !!(
      address &&
      (address.longDescription ||
        address.country ||
        address.state ||
        address.division ||
        address.city)
    );
  }

  async saveEducationalDetails(
    educationalDetails: EducationDetails,
    typeId: number,
    isAdd: boolean,
    index?: number
  ) {
    educationalDetails.startDate = this.appService.formatMomentDate(
      educationalDetails.startDate ?? ''
    );

    if (
      educationalDetails.isCurrent ||
      educationalDetails.endDate == 'Invalid date'
    ) {
      educationalDetails.endDate = null;
    } else {
      educationalDetails.endDate = this.appService.formatMomentDate(
        educationalDetails.endDate ?? ''
      );
    }

    if (typeId == 1) {
      if (isAdd) {
        this.profile.educationalHistory?.schools.push(educationalDetails);
      } else {
        if (
          this.profile.educationalHistory &&
          (index != null || index != undefined)
        ) {
          this.profile.educationalHistory.schools[index] = educationalDetails;
        }
      }
    } else if (typeId == 2) {
      if (isAdd) {
        this.profile.educationalHistory?.colleges.push(educationalDetails);
      } else {
        if (
          this.profile.educationalHistory &&
          (index != null || index != undefined)
        ) {
          this.profile.educationalHistory.colleges[index] = educationalDetails;
        }
      }
    } else if (typeId == 3) {
      if (isAdd) {
        this.profile.educationalHistory?.universities.push(educationalDetails);
      } else {
        if (
          this.profile.educationalHistory &&
          (index != null || index != undefined)
        ) {
          this.profile.educationalHistory.universities[index] =
            educationalDetails;
        }
      }
    }

    const profileRef = doc(
      this.appService._appDB,
      Collection.PROFILES,
      this.appService.userId
    );

    this.savingEducationProfession = true;

    await setDoc(profileRef, this.profile, { merge: true })
      .then((_) => {
        this.uiService.openSnackbar(
          `Education ${isAdd ? 'added' : 'updated'} successfully...`
        );
      })
      .catch((_) => {
        this.uiService.openSnackbar(
          `Error during ${
            isAdd ? 'adding' : 'updating'
          }  education. Please try after sometimes`
        );
      })
      .finally(() => {
        this.savingEducationProfession = false;
        this.uiService.closeDialog(null);
      });
  }

  async deleteEducationalDetails() {
    const profileRef = doc(
      this.appService._appDB,
      Collection.PROFILES,
      this.appService.userId
    );

    this.savingEducationProfession = true;

    await setDoc(profileRef, this.profile, { merge: true })
      .then((_) => {
        this.uiService.openSnackbar('Education deleted successfully...');
      })
      .catch((_) => {
        this.uiService.openSnackbar(
          'Error during deleting education. Please try after sometimes'
        );
      })
      .finally(() => {
        this.savingEducationProfession = false;
        this.uiService.closeDialog(null);
      });
  }

  async saveWorkExperience(
    workExperience: WorkExperience,
    isAdd: boolean,
    index?: number
  ) {
    workExperience.startDate = this.appService.formatMomentDate(
      workExperience.startDate ?? ''
    );

    if (workExperience.isCurrent || workExperience.endDate == 'Invalid date') {
      workExperience.endDate = null;
    } else {
      workExperience.endDate = this.appService.formatMomentDate(
        workExperience.endDate ?? ''
      );
    }

    if (isAdd) {
      this.profile.workExperiences?.push(workExperience);
    } else {
      if (
        this.profile.workExperiences &&
        (index != null || index != undefined)
      ) {
        this.profile.workExperiences[index] = workExperience;
      }
    }

    const profileRef = doc(
      this.appService._appDB,
      Collection.PROFILES,
      this.appService.userId
    );

    this.savingEducationProfession = true;

    await setDoc(profileRef, this.profile, { merge: true })
      .then((_) => {
        this.uiService.openSnackbar(
          `Work experience ${isAdd ? 'added' : 'updated'} successfully...`
        );
      })
      .catch((_) => {
        this.uiService.openSnackbar(
          `Error during ${
            isAdd ? 'adding' : 'updating'
          }  work experience. Please try after sometimes`
        );
      })
      .finally(() => {
        this.savingEducationProfession = false;
        this.uiService.closeDialog(null);
      });
  }

  async deleteWorkExperience() {
    const profileRef = doc(
      this.appService._appDB,
      Collection.PROFILES,
      this.appService.userId
    );

    this.savingEducationProfession = true;

    await setDoc(profileRef, this.profile, { merge: true })
      .then((_) => {
        this.uiService.openSnackbar('Work experience deleted successfully...');
      })
      .catch((_) => {
        this.uiService.openSnackbar(
          'Error during deleting work experience. Please try after sometimes'
        );
      })
      .finally(() => {
        this.savingEducationProfession = false;
        this.uiService.closeDialog(null);
      });
  }

  async saveProfile() {
    const profileRef = doc(
      this.appService._appDB,
      Collection.PROFILES,
      this.appService.userId
    );

    await setDoc(profileRef, this.profile, { merge: true });
  }
}
