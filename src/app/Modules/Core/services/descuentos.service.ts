import { Injectable, inject } from '@angular/core';
import { CRUDService } from '../interfaces/CRUD_service.interface';
import { Cupon } from '../models/Cupone.model';
import { Observable } from 'rxjs';
import { Descuento } from '../models/Descuento.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DescuentosService implements CRUDService<Descuento> {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl + '/descuentos';



  constructor() {}
  getAll(): Observable<Descuento[]> {
    return this.http.get<Descuento[]>(this.apiUrl);
  }
  getOne(id: string | number): Observable<Descuento[]> {
    throw new Error('Method not implemented.');
  }
  create(item: Cupon): Observable<Descuento> {
    throw new Error('Method not implemented.');
  }
  update(id: string | number, item: Descuento): Observable<Descuento> {
    throw new Error('Method not implemented.');
  }
  delete(id: string | number): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
