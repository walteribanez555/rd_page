import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IntentLogin, ResponseLogin } from '../models/IntentLogin';
import { Token } from '../../shared/utils/tokens';
import { ClientesService } from '../../Core/services';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private http = inject(HttpClient);

  private apiUrl = environment.apiAuthUrl + '/sessions';

  private clienteService  = inject(ClientesService);

  login(intentLogin: IntentLogin): Observable<ResponseLogin> {
    return this.http.post<ResponseLogin>(this.apiUrl, intentLogin).pipe(
      switchMap(resp => {
        const [client_id, ...office_id] = intentLogin.username.split('_');
        localStorage.setItem('username', client_id);
        localStorage.setItem('office_id', office_id.join());
        Token.setToken(resp.sessionToken);

        // Call the getClientId function here using switchMap
        return this.getClientId(client_id).pipe(
          switchMap(() => {
            return of(resp); // Return the original response from the login POST request
          })
        );
      })
    );
  }

  getClientId(client_id: string): Observable<any> {
    return this.clienteService.getOne(client_id).pipe(
      map(resp => {
        if (!resp || resp.length === 0) {
          throw new Error("No se encontró");
        }
        localStorage.setItem('client_id', resp[0].cliente_id!.toString());
        return resp; // Returning the response from the HTTP request
      })
    );
  }

  logout() {
    localStorage.removeItem('client_id');
    localStorage.removeItem('username');
    localStorage.removeItem('office_id');
    Token.deleteToken();
  }
}
