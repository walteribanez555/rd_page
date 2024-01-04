import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
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
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    const bodyElement = this.elRef.nativeElement.querySelector('body');
  }

  private notificationModalService = inject(NotificationService);
  private userService = inject(UserService);

  user: User | null = null;

  ngOnInit(): void {
    const username = localStorage.getItem('client_id');
    const office_id = localStorage.getItem('office_id');


    if( !username || !office_id){
      this.onError('Usuario No encontrado');
      return;
    }

    if (username && office_id) {
      this.userService.getUser(username + '_' + office_id).subscribe({
        next: (user) => {

          this.user = user[0];
        },
        error: (err) => {
          this.onError('Usuario No encontrado');
        },
        complete: () => {},
      });
    }



    if (window.innerWidth < 1024) {
      this.onTableDisplay = false;
    }

    // this.onError("No implementado correctamente");
  }
  // private renderer: Renderer2, private elementRef: ElementRef

  screenWidth?: number;

  private elRef = inject(ElementRef);

  onTableDisplay: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const withScreen: number = event.target.innerWidth;

    if (withScreen < 1024) {
      this.onTableDisplay = false;
      return;
    }
    this.onTableDisplay = true;
  }

  onChangeTypeListDisplay(state: boolean) {
    this.onTableDisplay = state;
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
