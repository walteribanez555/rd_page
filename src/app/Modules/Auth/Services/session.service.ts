import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IntentLogin, ResponseLogin } from '../models/IntentLogin';
import { Token } from '../../shared/utils/tokens';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiAuthUrl + '/sessions';

  login(intentLogin: IntentLogin): Observable<ResponseLogin> {
    return this.http.post<ResponseLogin>(this.apiUrl, intentLogin).pipe(
      tap( resp => {
        const [ client_id , ...office_id] = intentLogin.username.split('_');
        localStorage.setItem('client_id' , client_id);
        localStorage.setItem('office_id', office_id.join());
        Token.setToken(resp.sessionToken);
      })
    );
  }

  logout() {
    localStorage.removeItem('client_id');
    localStorage.removeItem('office_id');
    Token.deleteToken();
  }
}
