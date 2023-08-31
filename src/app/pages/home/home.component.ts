import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CajaService } from 'src/app/services/caja.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastrService } from 'ngx-toastr';
import { QuedanComponent } from 'src/app/pages/quedan/quedan.component';
import { MatDialog } from '@angular/material/dialog';
import { Comprobante } from 'src/app/models/comprobante.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  /* --------------------------------------------INFORMACION DE TABLA----------------------------------------------- */
  displayedColumns = ['position', 'tipo', 'clave', 'fecha', 'comprobante', 'Quitar'];
  // dataSource = ELEMENT_DATA;

  /* ----------------------------------------------------------------------------------------------------------------- */

  /* Form para los campos de la caja */
  public cajaForm = this.fb.group({
    descripcion: [''],
    codigo: ['23-AAC-1'],
    caducidad: [''],
    grupo: [''],
    estante: [''],
    nivel: [''],
    numero: [''],
  });

  /* Inicializar el boton */
  public boton_fijado: boolean = false;
  public contenidos: Comprobante[] = [] //Contenido de la caja que está en el txt, NO en la base

  /* Form para los campos del contenido (COMPROBANTES) de la caja */
  public contenidoForm = this.fb.group({
    caja: [''],
    tipo: [{ value: '', disabled: this.boton_fijado }],
    clave: [{ value: '', disabled: this.boton_fijado }],
    fecha: [{ value: '', disabled: this.boton_fijado }],
    correlativo: [''],
    tipodefault: [''],
    clavedefault: [''],
    mesaniodefault: [''],
  });

  constructor(
    private fb: FormBuilder,
    private cajaService: CajaService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  /* Funcion para fijar los campos  */
  fijar() {
    this.boton_fijado = !this.boton_fijado;
    if (this.boton_fijado) {
      this.contenidoForm.get('tipo')?.disable();
      this.contenidoForm.get('clave')?.disable();
      this.contenidoForm.get('fecha')?.disable();
    } else {
      this.contenidoForm.get('tipo')?.enable();
      this.contenidoForm.get('clave')?.enable();
      this.contenidoForm.get('fecha')?.enable();
    }
  }

  exito(resp: any) {
    this.toastr.success(resp.msg, '', {
      timeOut: 5000,
      progressBar: true,
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-right',
    });
  }

  error(err: any) {
    this.toastr.error(err.error.msg, '', {
      timeOut: 5000,
      progressBar: true,
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-right',
    });
  }

  errorCaja() {
    this.toastr.error('Caja no encontrada', '', {
      timeOut: 5000,
      progressBar: true,
      progressAnimation: 'decreasing',
      positionClass: 'toast-top-right',
    });
  }

  ngOnInit() {}

  /* Funcion que permite CREAR una caja y CARGAR sus datos en el formulario */
  crearCaja() {
    this.cajaService.crearCaja(this.cajaForm.value).subscribe(
      (resp: any) => {
        console.log(resp);

        /* mensaje de exito */
        this.exito(resp);

        this.cajaForm.setValue({
          descripcion: resp.caja.descripcion,
          codigo: resp.caja.codigo,
          caducidad: resp.caja.caducidad,
          grupo: resp.caja.grupo,
          estante: resp.caja.estante,
          nivel: resp.caja.nivel,
          numero: resp.caja.numero,
        });
      },
      (err) => {
        console.warn(err.error.msg);

        /* Mensaje de error */
        this.error(err);
      }
    );
  }

  /* Funcion que permite BUSCAR una caja y CARGAR sus datos en el formulario */
  cargarCaja() {
    const formData = this.cajaForm.value;
    const codigo = formData.codigo;

    if (codigo) {
      this.cajaService
        .cargarCaja(formData)

        .subscribe(
          (resp: any) => {
            console.log(this.cajaForm.value.codigo);

            this.cajaForm.setValue({
              descripcion: resp.caja.descripcion,
              codigo: resp.caja.codigo,
              caducidad: resp.caja.caducidad,
              grupo: resp.caja.grupo,
              estante: resp.caja.estante,
              nivel: resp.caja.nivel,
              numero: resp.caja.numero,
            });

            this.contenidos = resp.contenido // Obtener los contenidos del txt

            /* mensaje de exito */
            this.exito(resp);
          },
          (err) => {
            console.warn(err.error.msg);

            /* Mensaje de error */
            this.errorCaja();
          }
        );
    } else {
      // Cualquier validacion con codigo
    }
  }

  /* Funcion que permite BUSCAR una caja y CARGAR sus datos en el formulario */
  ingresarComprobantes() {
    this.cajaService.ingresarComprobantes(this.contenidoForm.value).subscribe(
      (resp: any) => {
        console.log(this.contenidoForm);
        console.log(resp);

        /* mensaje de exito */
        this.exito(resp);
      },
      (err) => {
        console.warn(err.error.msg);

        /* Mensaje de error */
        this.error(err);
      }
    );
  }

  reportePDF() {
    const codigo = this.cajaForm.value.codigo;

    if (!codigo) {
      console.error('El codigo esta vacio');
      return;
    }

    this.cajaService.reportePDF(codigo).subscribe(
      (resp: any) => {
        console.log(resp.file.data);

        const blob = new Blob([resp.file.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
  
        // Abrir el PDF en una nueva ventana o pestaña
        window.open(url, '_blank');

        /* mensaje de exito */
        this.exito(resp);
      },
      (err) => {
        console.warn(err.error.msg);
        

        /* Mensaje de error */
        this.error(err);
      }
    );
  }








  cargarQuedan(): void {

    const code = this.cajaForm.value.codigo || ''
  
    if (/^[0-9]{2}-[A]{2}[C]{1}-[0-9]{1,5}$/.test(code)) {
      //Abrir el Dialog con la inof
      const dialogRef = this.dialog.open(QuedanComponent, {
        data: {
          codigo: code
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        // console.log('The dialog was closed');
      });

    } else {
      this.toastr.error('No ha seleccionado una caja o no es un codigo de caja válido', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    }
  }

  quitarUno(comprobante: Comprobante){
    console.log(comprobante);

    const data = {
      caja: comprobante.caja,
      tipo: comprobante.tipo,
      clave: comprobante.clave,
      fecha: comprobante.fecha,
      correlativo: comprobante.correlativo,
    }
    
    this.cajaService.deleteOneContent(data)
    .subscribe((res:any) => {
      this.toastr.success('Comprobante Removido con éxito', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      this.cargarCaja()
    }, (err)=> {
        console.warn(err)
        this.toastr.error('No ha podido quitar el comprobante', '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
    })
    
  }

  vaciarCaja(codigo: string){
    console.log(codigo);
    
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

