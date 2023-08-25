import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import {Router} from "@angular/router";
import { Observable } from 'rxjs';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private globalHeaders = new HttpHeaders({'authorization': this.token});

  constructor(private http: HttpClient, private router : Router) { }

    login( formData: any ) {
      console.log(formData)
      return this.http.post(`${ base_url }/usuario/login`, formData )
                  .pipe(
                    tap( (resp: any) => {
                      console.log(resp)

                      localStorage.setItem('token', resp.token );
                      localStorage.setItem('usuario', JSON.stringify(resp.username))
                    })
                  );

    }

  logout() {
    localStorage.clear();
        this.router.navigateByUrl('/login');
  }





  // Crear al ADMIN-GOD si no existe un user con tipo = 0
  init () : Observable<void>{
    const headers = this.globalHeaders
    return this.http.get<void>(`${ base_url }/usuario/init`, {headers})
  }


}
