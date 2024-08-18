import { Component, inject } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Services
import { AppService } from '../../../../../core/services/app.service';

@Component({
  selector: 'app-emoticon-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './emoticon-dialog.component.html',
  styleUrl: './emoticon-dialog.component.scss',
})
export class EmoticonDialogComponent {
  appService = inject(AppService);

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

  filteredFeelings = this.appService.returnCopy(this.feelings);

  searchFeelings(event: any) {
    this.filteredFeelings = this.feelings.filter((feeling) =>
      feeling
        .toLocaleLowerCase()
        .includes(event.target.value.toLocaleLowerCase())
    );
  }
}
