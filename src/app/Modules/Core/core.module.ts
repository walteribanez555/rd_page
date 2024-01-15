import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  BeneficiariosService,
  BeneficiosService,
  CatalogosService,
  ClientesService,
  ComunicacionSiniestroService,
  CuponesService,
  DescuentosService,
  ExtrasService,
  PlanesService,
  PolizasService,
  PreciosService,
  ReembolsosService,
  ServiciosService,
  SiniestrosService,
  VentasService,

} from './services';
import { PolizasExtrasService } from './services/polizas-extras.service';
import { ReportesService } from './services/reportes.service';

@NgModule({
  declarations: [],
  imports: [RouterModule, CommonModule, HttpClientModule],
  providers: [
    BeneficiariosService,
    BeneficiosService,
    CatalogosService,
    ClientesService,
    ComunicacionSiniestroService,
    CuponesService,
    ExtrasService,
    PlanesService,
    PolizasService,
    PreciosService,
    ReembolsosService,
    ServiciosService,
    SiniestrosService,
    VentasService,
    DescuentosService,
    PolizasExtrasService,
    ReportesService,
  ],
  exports: [],
  bootstrap: [],
})
export class CoreModule {}
