import { Injectable, inject } from '@angular/core';

// Firebase
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

// Services
import { AppService } from '../core/services/app.service';
import { UiService } from '../core/services/ui.service';

// Models
import { Profile } from '../models/profile.model';

// Enums
import { Collection } from '../utils/enums/collection.enum';
import { Entity } from '../utils/enums/entity.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  appService = inject(AppService);
  uiService = inject(UiService);

  profiles: Profile[] = [];
  loadingProfiles: boolean = true;

  async getProfiles() {
    this.loadingProfiles = true;

    const profileCollection = collection(
      this.appService._appDB,
      Collection.PROFILES
    );
    const profileQuery = query(profileCollection, orderBy(Entity.DISPLAY_NAME));
    const profileSnap = await getDocs(profileQuery);

    this.loadingProfiles = false;

    this.profiles = [];

    profileSnap.forEach((profile) => {
      this.profiles.push(profile.data() as Profile);
    });
  }
}
