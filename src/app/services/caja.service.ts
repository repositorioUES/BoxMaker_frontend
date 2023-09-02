import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import {Router} from "@angular/router";
import { BehaviorSubject, Observable } from 'rxjs';
import { Comprobante } from '../models/comprobante.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  //Objeto para comuncarse entre componentes suscritos al servicio
  public $refreshTable = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router : Router) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  private globalHeaders = new HttpHeaders({'authorization': this.token});

  crearCaja(formData: any){
    const headers = this.globalHeaders
    return this.http.post(`${ base_url }/caja/create`, formData, {headers} )
  }

  cargarCaja(formData: any){
    const headers = this.globalHeaders
    return this.http.post(`${ base_url }/caja/one`, formData, {headers} )
}

  ingresarComprobantes(formData : any){
    const headers = this.globalHeaders
    return this.http.post(`${ base_url }/contenido/insert`, formData, {headers} )
  }

  reportePDF(codigo: string){
    const headers = this.globalHeaders
    const url = `${base_url}/caja/generatePDF/${codigo}`;
    /* console.log('URL de solicitud:', url); */
    return this.http.get(url, { headers });
  }










  getPDF(codigo: string): Promise<any> {
    return fetch(`${ base_url }/caja/generatePDF/${ codigo }`, {
      method: 'GET',
    });
  }

  deleteOneContent (caja: string, comp: any) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.post<void>(`${ base_url }/contenido/removeOne`, {caja, comp}, {headers})
  }

  deleteAllContent (codigo: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.delete<void>(`${ base_url }/contenido/deleteAll/${ codigo }`, {headers})
  }

  savetoDatabase (codigo: string) : Observable<void>{
    const headers = this.globalHeaders
    return this.http.get<void>(`${ base_url }/contenido/save/${ codigo }`, {headers})
  }
}

