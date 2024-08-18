import { Component } from '@angular/core';

// components
import { AppHeaderComponent } from '../../core/components/app-header/app-header.component';

// enums
import { PageType } from '../../utils/enums/page-type.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AppHeaderComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  pageTypes = PageType;
}
