import { Injectable } from '@angular/core';
import { CRUDService } from '../interfaces/CRUD_service.interface';
import { Precio } from '../models/Precio.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreciosService implements CRUDService<Precio> {
  constructor() {}
  getAll(): Observable<Precio[]> {
    throw new Error('Method not implemented.');
  }
  getOne(id: string | number): Observable<Precio[]> {
    throw new Error('Method not implemented.');
  }
  create(item: Precio): Observable<Precio> {
    throw new Error('Method not implemented.');
  }
  update(id: string | number, item: Precio): Observable<Precio> {
    throw new Error('Method not implemented.');
  }
  delete(id: string | number): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
