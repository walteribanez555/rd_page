import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'menu-hamburguer',
  template: `<div class="floating-container">
    <div class="floating-button">
      <i class="fa-solid fa-bars"></i>
    </div>

    <div class="element-container">
      <a class="float-element" routerLink="../dashboard/policies/list">
        <i class="fa-solid fa-user "></i>
      </a>
      <a class="float-element">
        <i class="fa-brands fa-whatsapp "></i>
      </a>
    </div>
  </div> `,
  styleUrls: ['./menuHamburguer.component.css'],
})
export class MenuHamburguerComponent {}
