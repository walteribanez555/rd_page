import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/Modules/Auth/Services/session.service';

@Component({
  selector: 'dashboard-navbar',
  templateUrl : './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {


  private router = inject(Router);
  private sessionService = inject(SessionService);

  logout(){
    this.sessionService.logout();
    this.router.navigateByUrl('/auth/login');
  }


}
