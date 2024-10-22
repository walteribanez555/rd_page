import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl : './back-button.component.html',
  styleUrls : ['./back-button.component.css'],

})
export class BackButtonComponent { }
