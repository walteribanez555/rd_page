import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Scroll to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight);
}



}
