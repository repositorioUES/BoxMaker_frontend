import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import {Router} from "@angular/router";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router : Router) { }

    login( formData: any ) {

      return this.http.post(`${ base_url }/usuario/login`, formData )
                  .pipe(
                    tap( (resp: any) => {
                      localStorage.setItem('token', resp.token );
                      localStorage.setItem('usuario', JSON.stringify(resp.username))
                    })
                  );

    }

  logout() {
    localStorage.clear();
        this.router.navigateByUrl('/login');
  }


}
