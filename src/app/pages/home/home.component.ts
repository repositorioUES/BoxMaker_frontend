import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CajaService } from 'src/app/services/caja.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastrService } from 'ngx-toastr';
import { QuedanComponent } from 'src/app/pages/quedan/quedan.component';
import { MatDialog } from '@angular/material/dialog';


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
    numero: ["",],
  });

  public contenidoForm = this.fb.group({
    codigo: ["",],
    tipo: ["",],
    clave: ["",],
    fecha: ["",],
    correlativo: ["",],
  });


  constructor(private fb: FormBuilder, private cajaService: CajaService, private toastr: ToastrService, private dialog: MatDialog) {
  }

  ngOnInit() {

  }

  /* Funcion que permite CREAR una caja y CARGAR sus datos en el formulario */
  crearCaja() {
    this.cajaService.crearCaja(this.cajaForm.value)
      .subscribe((resp: any) => {
        console.log(resp);
        this.cajaForm.setValue({
          descripcion: resp.caja.descripcion,
          codigo: resp.caja.codigo,
          caducidad: resp.caja.caducidad,
          grupo: resp.caja.grupo,
          estante: resp.caja.estante,
          nivel: resp.caja.nivel,
          numero: resp.caja.numero,
        });

        this.toastr.success(resp.msg, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });

      }, (err) => {
        console.warn(err.error.msg);
        this.toastr.success(err.error.msg, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
      });
  }
  /* Fin de la funcion crearCaja */

  /* Funcion que permite BUSCAR una caja y CARGAR sus datos en el formulario */
  cargarCaja() {

    const formData = this.cajaForm.value;
    const codigo = formData.codigo;

    if (codigo) {
      this.cajaService.cargarCaja(formData)

        .subscribe((resp: any) => {
          console.log(this.cajaForm)
          console.log(resp)
          
          this.cajaForm.setValue({
            descripcion: resp.caja.descripcion,
            codigo: resp.caja.codigo,
            caducidad: resp.caja.caducidad,
            grupo: resp.caja.grupo,
            estante: resp.caja.estante,
            nivel: resp.caja.nivel,
            numero: resp.caja.numero,
          });

          this.toastr.success(resp.msg, '', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'decreasing',
            positionClass: 'toast-top-right',
          });

        }, (err) => {
          console.warn(err.error.msg);

          this.toastr.error(err.error.msg, '', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'decreasing',
            positionClass: 'toast-top-right',
          });

        });
    } else {
      // Cualquier validacion con codigo
    }
  }
  /* Fin de la funcion cargarCaja */

  /* Funcion que permite BUSCAR una caja y CARGAR sus datos en el formulario */
  ingresarComprobantes(){
    const formData = this.contenidoForm.value;
    this.cajaService.ingresarComprobantes(formData)
      .subscribe((resp: any) => {
      console.log(this.contenidoForm)
      console.log(resp)

      this.toastr.success(resp.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });

    }, (err) => {
      console.warn(err.error.msg);

      this.toastr.error(err.error.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });

    });
} 

openDialog(id: string): void {

    const code = document.querySelector('#codigo')?.getAttribute('value')

    //Abrir el Dialog con la inof
    const dialogRef = this.dialog.open(QuedanComponent, {
      data: {
        codigo: code
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
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
  { position: 1, tipo: 'DIARIO', clave: 'XX', fecha: '31/03/2023', comprobante: 100 },
  { position: 2, tipo: 'EGRESO', clave: 'H4', fecha: '31/03/2023', comprobante: 1405 },
  { position: 3, tipo: 'INGRESO', clave: 'M1', fecha: '31/03/2023', comprobante: 3500 },
  { position: 4, tipo: 'DIARIO', clave: 'M3', fecha: '31/03/2023', comprobante: 933 },
  { position: 5, tipo: 'INGRESO', clave: 'H1', fecha: '31/03/2023', comprobante: 23 },
  { position: 6, tipo: 'EGRESO', clave: 'M3', fecha: '31/03/2023', comprobante: 60 },
  { position: 7, tipo: 'DIARIO', clave: 'XX', fecha: '31/03/2023', comprobante: 430 },
  { position: 8, tipo: 'INGRESO', clave: 'D2', fecha: '31/03/2023', comprobante: 349 },
  { position: 9, tipo: 'DIARIO', clave: 'D5', fecha: '31/03/2023', comprobante: 590 },
  { position: 10, tipo: 'EGRESO', clave: 'H2', fecha: '31/03/2023', comprobante: 100 },
];

/* ----------------------------------------------------------------------------------------------------------------- */

