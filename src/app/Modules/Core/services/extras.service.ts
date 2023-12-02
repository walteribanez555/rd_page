import { Injectable } from '@angular/core';
import { CRUDService } from '../interfaces/CRUD_service.interface';
import { Extra } from '../models/Extra.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExtrasService implements CRUDService<Extra> {

  constructor() { }
  getAll(): Observable<Extra[]> {
    throw new Error('Method not implemented.');
  }
  getOne(id: string | number): Observable<Extra[]> {
    throw new Error('Method not implemented.');
  }
  create(item: Extra): Observable<Extra> {
    throw new Error('Method not implemented.');
  }
  update(id: string | number, item: Extra): Observable<Extra> {
    throw new Error('Method not implemented.');
  }
  delete(id: string | number): Observable<any> {
    throw new Error('Method not implemented.');
  }

}
