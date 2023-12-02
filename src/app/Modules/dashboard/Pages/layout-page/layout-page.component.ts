import { Component, OnInit, inject } from '@angular/core';
import { BeneficiosService } from 'src/app/Modules/Core/services/beneficios.service';
import { CatalogosService } from 'src/app/Modules/Core/services/catalogos.service';
import { PlanesService } from 'src/app/Modules/Core/services/planes.service';
import { ServiciosService } from 'src/app/Modules/Core/services/servicios.service';

@Component({
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent  implements OnInit {
  ngOnInit(): void {
    this.servicioService.getAll().subscribe(
      {
        next : (data) => {
          console.log(data);

        },
        error : (err) => {
          console.log(err);

        },

        complete : ( ) => {

        }
      }
    );
    this.beneficiosService.getAll().subscribe(
      {
        next : ( data ) => {
          console.log(data);

        },
        error : ( err ) => {
          console.log(err);

        },
        complete : () => {

        }

      }
    )
    this.catalogosService.getAll().subscribe(
      {
        next : ( data ) => {
          console.log(data);

        },
        error : ( err ) => {
          console.log(err);

        },
        complete : () => {

        }

      }
    );
    this.planesService.getAll().subscribe(
      {
        next : (data) => {
          console.log(data);

        },
        error : ( err ) => {
          console.log(err);

        },
        complete : ( ) => {

        }

      }
    )

  }

  private servicioService = inject(ServiciosService);
  private beneficiosService = inject(BeneficiosService);
  private catalogosService = inject(CatalogosService);
  private planesService = inject(PlanesService);







}
