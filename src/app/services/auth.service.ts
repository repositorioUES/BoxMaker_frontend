import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

    login( formData: any ) {
    
      return this.http.post(`${ base_url }/usuario/login`, formData )
                  .pipe(
                    tap( (resp: any) => {
                      localStorage.setItem('token', resp.token )
                    })
                  );
  
    }


}
