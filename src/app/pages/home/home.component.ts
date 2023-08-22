import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent {
  displayedColumns = ['position', 'tipo', 'clave', 'fecha', 'comprobante'];
  dataSource = ELEMENT_DATA;

}

  export interface PeriodicElement {
    position: number;
    tipo: string;
    clave: string;
    fecha: string;
    comprobante: number;
  }
  const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, tipo: 'DIARIO', clave: 'XX', fecha: '31/03/2023', comprobante: 100},
    {position: 2, tipo: 'EGRESO', clave: 'H4', fecha: '31/03/2023', comprobante: 1405},
    {position: 3, tipo: 'INGRESO', clave: 'M1', fecha: '31/03/2023', comprobante: 3500},
    {position: 4, tipo: 'DIARIO', clave: 'M3', fecha: '31/03/2023', comprobante: 933},
    {position: 5, tipo: 'INGRESO', clave: 'H1', fecha: '31/03/2023', comprobante: 23},
    {position: 6, tipo: 'EGRESO', clave: 'M3', fecha: '31/03/2023', comprobante: 60},
    {position: 7, tipo: 'DIARIO', clave: 'XX', fecha: '31/03/2023', comprobante: 430},
    {position: 8, tipo: 'INGRESO', clave: 'D2', fecha: '31/03/2023', comprobante: 349},
    {position: 9, tipo: 'DIARIO', clave: 'D5', fecha: '31/03/2023', comprobante: 590},
    {position: 10, tipo: 'EGRESO', clave: 'H2', fecha: '31/03/2023', comprobante: 100},
  ];

