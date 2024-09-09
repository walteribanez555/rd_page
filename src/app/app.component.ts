import { Component, OnInit, inject } from '@angular/core';
import { PlanesService } from './Modules/Core/services';


(window as any).global = window;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  private planesService = inject(PlanesService);

  ngOnInit(): void {






    // StorageVersion.isActualVersionStorage();


    // const data = "{\"duracion\":30, \"caduca\":'2025-02-01'}";
    // const prueb3Data = "\"{\"duracion\":30,\"caduca\":\"2025-02-01\"}\"";

    // const pruebdata = `null, "{""duracion":30; "caduca":"2025-02-01""}"`
    // const dat =[ null, {
    //   duracion : 30,
    //   caduca : '2025-02-01'
    // }]

    // const dataToMap =JSON.stringify(dat)
    // console.log({data : dataToMap});



    // this.ventaService.create(nuevaVenta).subscribe({
    //   next : (resp) => {
    //     console.log({resp});
    //   }
    // })


    gtag('event', 'page_view', {
      page_title: this.title,
      page_path: "cotizar",
      page_location: "cotizar"
    })


  }
  title = 'redcard';






}
