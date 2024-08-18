import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    NgOptimizedImage,
  ],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss',
})
export class ImageViewerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) {
    this.adjustImageDimension();
  }

  adjustImageDimension() {
    setTimeout(() => {
      const container: HTMLElement | null = document.querySelector(
        '.mat-mdc-dialog-content'
      );

      const image = new Image();
      image.src = this.data.url;

      image.onload = function () {
        const { width, height } = image;

        if (container) {
          if (width > 750 || height > 750) {
            container.style.backgroundSize = 'contain';
          } else {
            container.style.backgroundSize = `${width}px ${height}px`;
          }
        }
      };
    }, 0);
  }
}
