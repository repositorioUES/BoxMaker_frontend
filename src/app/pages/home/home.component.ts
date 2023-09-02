import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CajaService } from 'src/app/services/caja.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { ToastrService } from 'ngx-toastr';
import { QuedanComponent } from 'src/app/pages/quedan/quedan.component';
import { InsertarComponent } from 'src/app/pages/insertar/insertar.component';
import { MatDialog } from '@angular/material/dialog';
import { Comprobante } from 'src/app/models/comprobante.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  /* --------------------------------------------INFORMACION DE TABLA----------------------------------------------- */
  displayedColumns = ['position', 'tipo', 'clave', 'fecha', 'comprobante', 'Insertar','Quitar'];
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
  public longitud: number = 0 //cuámtos contenidos se recuperaron

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

  ngOnInit() { 
    // Se suscribe para detecter cada vez que la variable $refreshTable cambie
    this.cajaService.$refreshTable.subscribe(data => {
      this.cargarCaja()
    });
  }

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
       
        if(resp.from = 'update')
          this.guardarContenidos(resp.caja.codigo)
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

            this.contenidos = resp.contenido // Obtener los contenidos del json
            this.longitud =  this.contenidos.length -1

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





  







  generatePDF(){
    const codigo = this.cajaForm.value.codigo;

    if (!codigo) {
      console.error('El Código de Caja esta vacio');
      return;
    }
    
    this.cajaService.getPDF(codigo)
    .then(response => response.blob())
    .then(pdf => {
      window.open(URL.createObjectURL(pdf), '_blank');
    })
    .catch(err => {
      console.log(err);
      this.toastr.error('Ha ocurrido un error al generar el reporte en PDF: ' + err, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    });
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

  insertarDebajo(index: number){
    const code = this.cajaForm.value.codigo || ''
  
    if (/^[0-9]{2}-[A]{2}[C]{1}-[0-9]{1,5}$/.test(code)) {
      //Abrir el Dialog con la inof
      const dialogRef = this.dialog.open(InsertarComponent, {
        data: {
          codigo: code,
          index: index
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

  async quitarUno(index: number){
    let newArray: Comprobante[] = []
    const codigo = this.cajaForm.value.codigo || ''

    const { isConfirmed } = await Swal.fire({
      title: '¿Quitar éste Comprobante  de la Caja '+ codigo +'?',
      showCancelButton: true
    })

    if (isConfirmed) {
      for (let i  = 0; i < this.contenidos.length; i++) {
        if(i != index){
          newArray.push(this.contenidos[i])
        }
      }   
      
      this.cajaService.deleteOneContent(codigo, newArray)
      .subscribe((res:any) => {

        Swal.fire('Comprobante Removido con éxito', 'Completado')
        
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
  }

  async vaciarCaja(){
    const codigo = this.cajaForm.value.codigo || ''

    const { isConfirmed } = await Swal.fire({
      title: '¿Borrar todo el Contendo de la Caja '+ codigo +'?',
      showCancelButton: true
    })

    if (isConfirmed) {
      this.cajaService.deleteAllContent(codigo)
      .subscribe((res:any) => {

        Swal.fire('La caja ' + codigo + ' ahora está Vacia', 'Completado')

        this.cargarCaja()
      }, (err)=> {
          console.warn(err)
          this.toastr.error('No se ha podido vaciar la caja', '', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'decreasing',
            positionClass: 'toast-top-right',
          });
      })
    }
  }

  guardarContenidos(codigo: string){
    this.cajaService.savetoDatabase(codigo)
    .subscribe((res:any) => {
      this.toastr.success('Contenido de la caja ' + codigo +' guardado en la Base de Datos', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    }, (err)=> {
        console.warn(err)
        this.toastr.error('No se ha podido guardar el contenido de la caja', '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
    })
  }
}
