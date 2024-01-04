import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiAuthUrl + '/users';

  getUser(username: string): Observable<User[]> {
    let params = new HttpParams();
    params = params.append('id', username);

    return this.http.get<User[]>(this.apiUrl, { params });
  }
}
