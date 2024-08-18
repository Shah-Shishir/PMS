import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { AddUpdateEducationProfessionDialogComponent } from './add-update-education-profession-dialog/add-update-education-profession-dialog.component';
import { ConfirmDeleteDialogComponent } from '../../../../../core/components/confirm-delete-dialog/confirm-delete-dialog.component';

// Models
import {
  EducationDetails,
  WorkExperience,
} from '../../../../../models/profile.model';

// Services
import { ProfileService } from '../../../../../services/profile.service';
import { UiService } from '../../../../../core/services/ui.service';

// Enums
import { InstitutionType } from '../../../../../utils/enums/institution-type.enum';

@Component({
  selector: 'profile-education-profession',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DatePipe,
  ],
  templateUrl: './education-profession.component.html',
  styleUrl: './education-profession.component.scss',
})
export class EducationProfessionComponent {
  isEducation = input.required<boolean>();

  profileService = inject(ProfileService);
  uiService = inject(UiService);

  institutionTypes = InstitutionType;

  openAddUpdateDialog(type: string, isAdd: boolean, details?: any) {
    if (this.isEducation()) {
      this.openEducationAddUpdateDialog(type, isAdd, details);
    } else {
    }
  }

  openEducationAddUpdateDialog(
    institutionType: string,
    isAdd: boolean,
    details?: EducationDetails
  ) {
    this.uiService.openDialog(
      AddUpdateEducationProfessionDialogComponent,
      {
        isEducation: this.isEducation(),
        institutionType: institutionType || null,
        isAdd,
        details,
      },
      '400px'
    );
  }

  openProfessionAddUpdateDialog(isAdd: boolean, details?: EducationDetails) {
    this.uiService.openDialog(
      AddUpdateEducationProfessionDialogComponent,
      {
        isEducation: this.isEducation(),
        isAdd,
        details,
      },
      '400px'
    );
  }

  editEducationalDetail(
    institutionType: string,
    educationDetails: EducationDetails,
    index: number
  ) {
    this.uiService.openDialog(
      AddUpdateEducationProfessionDialogComponent,
      {
        isEducation: true,
        institutionType: institutionType || null,
        isAdd: false,
        details: educationDetails,
        index,
      },
      '400px'
    );
  }

  editWorkExperience(workExperience: WorkExperience, index: number) {
    this.uiService.openDialog(
      AddUpdateEducationProfessionDialogComponent,
      {
        isEducation: false,
        isAdd: false,
        details: workExperience,
        index,
      },
      '400px'
    );
  }

  deleteEducationalDetail(institutionType: string, index: number) {
    let deleteText: string = `this ${institutionType.toLocaleLowerCase()}`;

    this.uiService.openDialog(ConfirmDeleteDialogComponent, {
      deleteText,
    });

    this.uiService.dialogRef.afterClosed().subscribe((res: any) => {
      if (res && this.profileService.profile.educationalHistory) {
        let { schools, colleges, universities } =
          this.profileService.profile.educationalHistory;

        if (institutionType === InstitutionType.SCHOOL) {
          schools.splice(index, 1);
          this.profileService.profile.educationalHistory.schools = schools;
        } else if (institutionType === InstitutionType.COLLEGE) {
          colleges.splice(index, 1);
          this.profileService.profile.educationalHistory.colleges = colleges;
        } else if (institutionType === InstitutionType.UNIVERSITY) {
          universities.splice(index, 1);
          this.profileService.profile.educationalHistory.universities =
            universities;
        }

        this.profileService.deleteEducationalDetails();
      }
    });
  }

  deleteWorkExperience(index: number) {
    let deleteText: string = 'this work experience';

    this.uiService.openDialog(ConfirmDeleteDialogComponent, {
      deleteText,
    });

    this.uiService.dialogRef.afterClosed().subscribe((res: any) => {
      if (res && this.profileService.profile.workExperiences) {
        this.profileService.profile.workExperiences.splice(index, 1);
        this.profileService.deleteWorkExperience();
      }
    });
  }
}
