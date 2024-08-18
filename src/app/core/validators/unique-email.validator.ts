// Forms
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';

// Firestore
import { collection, where, query, getDocs } from 'firebase/firestore';

// Services
import { AppService } from '../services/app.service';

// Enums
import { Entity } from '../../utils/enums/entity.enum';
import { Collection } from '../../utils/enums/collection.enum';
import { Message } from '../../utils/constants/message';

export class UniqueEmailValidator {
  static createValidator(appService: AppService): AsyncValidatorFn {
    return async (
      control: AbstractControl
    ): Promise<ValidationErrors | null> => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const profileQuery = query(
        collection(appService._appDB, Collection.PROFILES),
        where(Entity.EMAIL, '==', value)
      );

      const profileSnap = await getDocs(profileQuery);

      return profileSnap.empty ? null : { uniqueEmail: Message.emailTaken };
    };
  }
}
