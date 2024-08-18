import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  isFileImage(file: File) {
    return file && file.type.split('/')[0] === 'image';
  }

  blobToDataURL(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (_e) => resolve(reader.result as string);
      reader.onerror = (_e) => reject(reader.error);
      reader.onabort = (_e) => reject(new Error('Read aborted'));
      reader.readAsDataURL(blob);
    });
  }
}
