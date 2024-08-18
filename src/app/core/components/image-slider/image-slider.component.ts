import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  Component,
  Signal,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

// Angular Material
import { MatIconModule } from '@angular/material/icon';

interface Image {
  image: string;
  order: number;
}

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgOptimizedImage],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.scss',
})
export class ImageSliderComponent {
  images = input<Image[]>();
  onCloseSlider = output<void>();

  currentIndex: number = 0;
  currentImageUrl: Signal<string | undefined> = signal('');
  imageCount: Signal<number | undefined> = signal(0);
  isLoading: boolean = true;
  backgroundSize: string = 'contain';

  ngOnInit() {
    this.computeCurrentImageUrl();
    this.imageCount = computed(() => this.images()?.length) ?? 0;
  }

  computeCurrentImageUrl() {
    this.isLoading = true;
    this.backgroundSize = 'contain';

    this.currentImageUrl = computed(
      () => this.images()?.at(this.currentIndex)?.image
    );

    const container: HTMLElement | null =
      document.querySelector('.current-image');

    const image = new Image();
    image.src = this.currentImageUrl() ?? '';

    image.onload = () => {
      const { width, height } = image;

      if (container) {
        if (width > 750 || height > 750) {
          this.backgroundSize = 'contain';
        } else {
          this.backgroundSize = `${width}px ${height}px`;
        }
      }

      this.isLoading = false;
    };
  }

  goToPreviousImage() {
    if (this.currentIndex - 1 >= 0) {
      --this.currentIndex;
    } else {
      this.currentIndex = this.imageCount()! - 1;
    }

    this.computeCurrentImageUrl();
  }

  goToNextImage() {
    if (this.currentIndex + 1 < this.imageCount()!) {
      ++this.currentIndex;
    } else {
      this.currentIndex = 0;
    }

    this.computeCurrentImageUrl();
  }
}
