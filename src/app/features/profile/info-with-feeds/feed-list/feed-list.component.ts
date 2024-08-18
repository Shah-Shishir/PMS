import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// Components
import { ImageSliderComponent } from '../../../../core/components/image-slider/image-slider.component';

// Service
import { ProfileService } from '../../../../services/profile.service';
import { UiService } from '../../../../core/services/ui.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Pipes
import { TimeDifferenceTextPipe } from '../../../../core/pipes/time-difference-text.pipe';
import { PrivacyIconPipe } from '../../../../core/pipes/privacy-icon.pipe';
import { PrivacyTypePipe } from '../../../../core/pipes/privacy-type.pipe';

// Models
import { ProfileFeed } from '../../../../models/profile-feed.model';

interface Image {
  image: string;
  order: number;
}
@Component({
  selector: 'profile-feed-list',
  standalone: true,
  templateUrl: './feed-list.component.html',
  styleUrl: './feed-list.component.scss',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    ImageSliderComponent,
    DatePipe,
    TimeDifferenceTextPipe,
    PrivacyIconPipe,
    PrivacyTypePipe,
  ],
})
export class FeedListComponent {
  profileService = inject(ProfileService);
  uiService = inject(UiService);

  images: Image[] = [];
  isOpenSlider: boolean = false;

  privacyOptions = [
    {
      id: 1,
      label: 'Public',
      icon: 'public',
    },
    {
      id: 2,
      label: 'Friends',
      icon: 'group',
    },
    {
      id: 3,
      label: 'Only Me',
      icon: 'lock',
    },
  ];

  openImageSlider(
    photos: {
      name: string;
      url: string;
    }[],
    index: number
  ) {
    this.images = [];

    for (let i = index; i < photos.length; i++) {
      this.images.push({
        image: photos[i].url,
        order: this.images.length + 1,
      });
    }

    for (let i = 0; i < index; i++) {
      this.images.push({
        image: photos[i].url,
        order: this.images.length + 1,
      });
    }

    this.isOpenSlider = true;
  }

  closeSlider() {
    this.images = [];
    this.isOpenSlider = false;
  }

  isLiked(feed: ProfileFeed) {
    return !!feed.likes.users.find(
      (user) => user.userId === this.profileService.profile.uid
    );
  }

  likeUnlikeFeed(index: number) {
    let { count, users } = this.profileService.profile.feeds[index].likes;
    const { firstName, lastName, uid } = this.profileService.profile;
    const foundIndex: number = users.findIndex((user) => user.userId === uid);

    if (foundIndex >= 0) {
      users.splice(foundIndex, 1);
      --count;
    } else {
      users.push({
        userId: uid,
        name: `${firstName} ${lastName}`,
      });
      ++count;
    }

    this.profileService.profile.feeds[index].likes = {
      count,
      users,
    };

    this.profileService.saveProfile();
  }
}
