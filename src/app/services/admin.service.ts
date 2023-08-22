import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}

  getUsers () : Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${ base_url }/usuario/all`)
  }

  deleteUser (id: string) : Observable<void>{
    return this.http.delete<void>(`${ base_url }/usuario/delete/${ id }`)
  }

  changeState (id: string) : Observable<void>{
    return this.http.get<void>(`${ base_url }/usuario/changeState/${ id }`)
  }

  unlock (id: string) : Observable<void>{
    return this.http.get<void>(`${ base_url }/usuario/unlock/${ id }`)
  }

  resetPassword (id: string) : Observable<void>{
    return this.http.get<void>(`${ base_url }/usuario/resetPassword/${ id }`)
  }
}
