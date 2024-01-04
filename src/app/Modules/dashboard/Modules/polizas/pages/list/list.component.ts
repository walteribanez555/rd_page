import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    const bodyElement = this.elRef.nativeElement.querySelector('body');
  }
  ngOnInit(): void {

    if(window.innerWidth < 1024) {
      this.onTableDisplay=false;
    }

  }
  // private renderer: Renderer2, private elementRef: ElementRef

  screenWidth?: number;

  private elRef = inject(ElementRef);

  onTableDisplay: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {

    const withScreen : number = event.target.innerWidth;

    if(withScreen<1024){
      this.onTableDisplay = false;
      return;
    }
    this.onTableDisplay= true;
  }

  onChangeTypeListDisplay( state : boolean) {
    this.onTableDisplay = state;
  }
}
