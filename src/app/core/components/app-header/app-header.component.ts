import { Component, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

// Angular Material
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

// Components
import { ImagePlaceholderComponent } from '../image-placeholder/image-placeholder.component';

// Router
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// Services
import { AppService } from '../../services/app.service';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';

// Enums
import { PageType } from '../../../utils/enums/page-type.enum';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    RouterLink,
    NgOptimizedImage,
    ImagePlaceholderComponent,
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  centreTitle = input<boolean>(false);
  pageType = input<string>();
  pageTypes = PageType;

  route = inject(ActivatedRoute);
  router = inject(Router);

  appService = inject(AppService);
  authService = inject(AuthService);
  profileService = inject(ProfileService);

  ngOnInit() {
    const userId: string = this.appService.getRouteParamData(this.route, 'id');
    userId && this.profileService.getProfileFromDb(userId);
  }
}
