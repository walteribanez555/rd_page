import { Component, OnInit } from '@angular/core';
import { StorageVersion } from './Modules/shared/utils/storageVersion';


(window as any).global = window;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    StorageVersion.isActualVersionStorage();
  }
  title = 'redcard';


}
