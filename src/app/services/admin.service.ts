import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  $switch = new EventEmitter<any>();

  //Observable que emitirá cada ve que cambie el valor de $userId
  $userId = new EventEmitter<string>();
  $userName = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private globalHeaders = new HttpHeaders({'authorization': this.token});


  getUsers () : Observable<Usuario[]>{
    const headers = this.globalHeaders
    return this.http.get<Usuario[]>(`${ base_url }/usuario/all`, {headers})
  }

  deleteUser (id: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.delete<void>(`${ base_url }/usuario/delete/${ id }`, {headers})
  }

  changeState (id: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.get<void>(`${ base_url }/usuario/changeState/${ id }`, {headers})
  }

  unlock (id: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.get<void>(`${ base_url }/usuario/unlock/${ id }`, {headers})
  }

  resetPassword (id: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.get<void>(`${ base_url }/usuario/resetPassword/${ id }`, {headers})
  }

  // FUNCIONES PARA LA GESTION DE PERMISOS==========================================================
  getPermissions (id: string) : Observable<void>{
    const headers = this.globalHeaders
    console.log(id)
    return this.http.get<void>(`${ base_url }/permiso/byUser/${ id }`, {headers})
  }

  grantPermission () : Observable<void>{
    const headers = this.globalHeaders
    return this.http.delete<void>(`${ base_url }/permiso/grant/${ this.$userId }`, {headers})
  }

  denyPermission () : Observable<void>{
    const headers = this.globalHeaders
    return this.http.delete<void>(`${ base_url }/permiso/deny/${ this.$userId }`, {headers})
  }


}
