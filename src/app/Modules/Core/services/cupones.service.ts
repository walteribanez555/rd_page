import { Injectable } from '@angular/core';
import { CRUDService } from '../interfaces/CRUD_service.interface';
import { Cupon } from '../models/Cupone.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CuponesService implements CRUDService<Cupon> {
  constructor() {}
  getAll(): Observable<Cupon[]> {
    throw new Error('Method not implemented.');
  }
  getOne(id: string | number): Observable<Cupon[]> {
    throw new Error('Method not implemented.');
  }
  create(item: Cupon): Observable<Cupon> {
    throw new Error('Method not implemented.');
  }
  update(id: string | number, item: Cupon): Observable<Cupon> {
    throw new Error('Method not implemented.');
  }
  delete(id: string | number): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
