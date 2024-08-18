import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { AppSelectComponent } from '../../../../core/components/app-select/app-select.component';
import { EmoticonDialogComponent } from './emoticon-dialog/emoticon-dialog.component';
import { ImageViewerComponent } from '../../../../core/components/image-viewer/image-viewer.component';

// Services
import { ProfileService } from '../../../../services/profile.service';
import { UiService } from '../../../../core/services/ui.service';

// Pipes
import { PrivacyTypePipe } from '../../../../core/pipes/privacy-type.pipe';

@Component({
  selector: 'profile-feed-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AppSelectComponent,
    PrivacyTypePipe,
  ],
  templateUrl: './feed-form.component.html',
  styleUrl: './feed-form.component.scss',
})
export class FeedFormComponent {
  profileService = inject(ProfileService);
  uiService = inject(UiService);

  enteredLocation: string = '';
  isLocationInputOpened: boolean = false;

  feelings: string[] = [
    'Happy 😃',
    'Excited 🤩',
    'Joyful 😊',
    'Grateful 🙏',
    'Content 😌',
    'Optimistic 🌞',
    'Proud 🎉',
    'Loved ❤️',
    'Amused 😆',
    'Relieved 😅',
    'Calm 😌',
    'Relaxed 🛋️',
    'Neutral 😐',
    'Curious 🤔',
    'Thoughtful 🤔',
    'Reflective 🧐',
    'Indifferent 😶',
    'Contemplative 🧘',
    'Peaceful ☮️',
    'Satisfied 🙂',
    'Sad 😢',
    'Angry 😠',
    'Frustrated 😤',
    'Anxious 😟',
    'Disappointed 😞',
    'Lonely 😔',
    'Annoyed 😒',
    'Jealous 😒',
    'Hurt 😢',
    'Guilty 😳',
    'Nostalgic 😌',
    'Conflicted 😕',
    'Hopeful 🙏',
    'Overwhelmed 😵',
    'Worried 😟',
    'Awkward 😬',
    'Embarrassed 😳',
    'Empowered 💪',
    'Envious 😒',
    'Shocked 😲',
    'Motivated 💪',
    'Determined 🏋️',
    'Surprised 😮',
    'Inspired 🌟',
    'Bored 😴',
    'Sleepy 😴',
    'Energetic ⚡',
    'Confident 😎',
    'Hungry 🍽️',
    'Stressed 😫',
  ];

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

  removeFeeling() {
    this.profileService.feed.feeling = '';
  }

  removeCheckIn() {
    this.profileService.feed.checkIn = '';
    this.enteredLocation = '';
  }

  onKeyDown(event: any) {
    if (event.keyCode === 13) {
      this.profileService.feed.checkIn = event.target.value;
      this.isLocationInputOpened = false;
    }
  }

  adjustTextareaHeight(event: any) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  openEmoticonDialog() {
    this.uiService.openDialog(EmoticonDialogComponent, {}, '785px');

    this.uiService.dialogRef.afterClosed().subscribe((feeling: string) => {
      if (feeling) {
        this.profileService.feed.feeling = feeling;
      }
    });
  }

  selectPhotos() {
    (
      document.querySelector('#multiple-file-input') as HTMLInputElement
    )?.click();
  }

  viewFeedImage(url: string) {
    this.uiService.openDialog(ImageViewerComponent, {
      url,
    });
  }

  removeFeedImage(index: number) {
    this.profileService.removeFeedPhoto(index);
  }

  publishFeed() {
    this.profileService.publishFeed();
  }
}
