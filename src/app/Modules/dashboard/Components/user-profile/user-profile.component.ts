import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/Modules/Auth/Services/user.service';
import { User } from 'src/app/Modules/Auth/models/User';
import {
  Size,
  PositionMessage,
} from 'src/app/Modules/shared/Components/notification/enums';
import { NotificationService } from 'src/app/Modules/shared/Components/notification/notification.service';

@Component({
  selector: 'user-profile',
  template: `<div class="top">
      <div class="profile">
        <div class="avatar">
          <i class="fa-solid fa-user"></i>
        </div>
        <img
          width="50px"
          height="20px"
          *ngIf="!user; else isUser"
          src="assets/icons/loading-white.svg"
        />
        <ng-template #isUser>
          <span class="name-user">{{ user!.email }}</span>
        </ng-template>
      </div>

      <div class="language">
        <select name="" id="">
          <option value="">Español</option>
          <option value="">Portugues</option>
          <option value="">Ingles</option>
        </select>
      </div>


    </div>
    `,
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private notificationModalService = inject(NotificationService);
  private userService = inject(UserService);
  user: User | null = null;

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    const office_id = localStorage.getItem('office_id');

    if (!username || !office_id) {
      this.onError('Usuario No encontrado');
      return;
    }

    if (username && office_id) {
      this.userService.getUser(username + '_' + office_id).subscribe({
        next: (user) => {
          console.log({user});
          this.user = user[0];
        },
        error: (err) => {
          this.onError('Usuario No encontrado');
        },
        complete: () => {},
      });
    }
  }

  onSuccess(message: string) {
    this.notificationModalService.show(message, {
      size: Size.normal,
      duration: 3000,
      positions: [PositionMessage.center],
      imageUrl: 'assets/icons/check.svg',
      closeOnTouch: true,
    });
  }

  onError(message: string) {
    this.notificationModalService.show(message, {
      size: Size.normal,
      duration: 3000,
      positions: [PositionMessage.center],
      imageUrl: 'assets/icons/warning.svg',
      closeOnTouch: true,
    });
  }

  onLoading(observerProcess: Observable<any>) {
    this.notificationModalService.show('Cargando', {
      size: Size.normal,
      positions: [PositionMessage.center],
      imageUrl: 'assets/icons/loading.svg',
      closeOnTouch: false,
      notifier: observerProcess,
    });
  }
}
