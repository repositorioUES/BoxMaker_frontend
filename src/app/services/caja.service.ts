import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import {Router} from "@angular/router";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(private http: HttpClient, private router : Router) { }

  get token(): string {
    return localStorage.getItem('token') || 'baaaka!';
  }

  private globalHeaders = new HttpHeaders({'authorization': this.token});



  crearCaja(formData: any){
    const headers = this.globalHeaders
    return this.http.post(`${ base_url }/caja/create`, formData, {headers} )
  }






}
