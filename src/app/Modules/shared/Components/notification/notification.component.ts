import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { TypeMessage } from './enums/TypeMessage.enum';
import { Size } from './enums/SizeMessage.enum';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'notification',
  styleUrls: ['./notification.component.css'],
  templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
  private elementRef = inject(ElementRef);

  ngOnInit(): void {
    if (this.duration) {
      setTimeout(() => {
        this.onFinish();
      }, this.duration);
    }

    this.servicesNotifier?.subscribe({
      complete: () => {
        this.onFinish();
      },
    });
  }

  @Input() servicesNotifier?: Observable<string>;
  @Input() size? = Size.normal;
  @Input() message?: string;
  @Input() duration?: number | null = null;
  @Input() imageUrl?: string = '';
  @Input() positions?: string = 'center';
  @Input() closeOnTouch?: boolean = false;

  @Output() closeEvent = new EventEmitter();

  onTouchModal() {
    if (this.closeOnTouch) {
      this.onFinish();
    }
  }

  onFinish() {
    this.elementRef.nativeElement.remove();

    this.closeEvent.emit();
  }
}
