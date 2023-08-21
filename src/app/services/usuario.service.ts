import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  crearUsuario( formData: any ) {

    return this.http.post(`${ base_url }/usuario/register`, formData)
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token );
                    localStorage.setItem('usuario', JSON.stringify(resp.userName))
                  })
                )

  }

}
