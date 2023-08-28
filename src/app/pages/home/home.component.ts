import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CajaService} from 'src/app/services/caja.service';
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  /* --------------------------------------------INFORMACION DE TABLA----------------------------------------------- */
  displayedColumns = ['position', 'tipo', 'clave', 'fecha', 'comprobante'];
  dataSource = ELEMENT_DATA;


  /* ----------------------------------------------------------------------------------------------------------------- */


  public cajaForm = this.fb.group({
    descripcion: ["",],
    codigo: ["",],
    caducidad: ["",],
    grupo: ["",],
    estante: ["",],
    nivel: ["",],
  });


  constructor(private fb: FormBuilder, private cajaService: CajaService, private snack: MatSnackBar) {
  }

  ngOnInit() {

  }

  crearCaja() {
    this.cajaService.crearCaja(this.cajaForm.value)
      .subscribe((resp: any) => {
        console.log(resp);
        this.snack.open('Caja Creada', 'Aceptar', {
          duration: 7000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });

        this.cajaForm.setValue({
          descripcion: resp.descripcion,
          codigo: resp.codigo,
          caducidad: resp.caducidad,
          grupo: resp.grupo,
          estante: resp.estante,
          nivel: resp.nivel,
        });
      }, (err) => {
        console.warn(err.error.msg);
        this.snack.open(err.error.msg, 'Error', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
      });
  }

  cargarCaja() {

    const formData = this.cajaForm.value;
    const codigo = formData.codigo;

    if (codigo) {
      this.cajaService.cargarCaja(formData)

        .subscribe((resp: any) => {
          console.log(this.cajaForm)
          console.log(resp)

          this.snack.open('Caja recuperada', 'Aceptar', {
            duration: 7000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });


          this.cajaForm.patchValue({
            descripcion: resp.caja.descripcion,
            codigo: resp.caja.codigo,
            caducidad: resp.caja.caducidad,
            grupo: resp.caja.grupo,
            estante: resp.caja.estante,
            nivel: resp.caja.nivel,
          });
        }, (err) => {
          console.warn(err.error.msg);
          /*          this.snack.open(err.error.msg, 'Error', {
                      duration: 5000,
                      verticalPosition: 'bottom',
                      horizontalPosition: 'center'
                    });*/

          this.snack.open('Caja No encontrada', 'ERROR', {
            duration: 7000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });

        });
    } else {

    }
  }
}


/* --------------------------------------------INFORMACION DE TABLA----------------------------------------------- */
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

/* ----------------------------------------------------------------------------------------------------------------- */

