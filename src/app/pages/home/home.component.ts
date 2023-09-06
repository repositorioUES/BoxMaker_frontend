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
import { AstTransformer } from '@angular/compiler';
import { query } from '@angular/animations';


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
    codigo: [''],
    caducidad: [''],
    grupo: [''],
    estante: [''],
    nivel: [''],
    numero: [''],
    usuario: [localStorage.getItem('usuario')?.replace(/"+/g,'')],
  });

  /* Inicializar el boton */
  public contenidos: Comprobante[] = [] //Contenido de la caja que está en el txt, NO en la base
  public longitud: number = 0 //cuántos contenidos se recuperaron

  public generando: number = 0//   1 = Se está generando algun documento y por tanto, mostrar el loader;   0 = nada
  public loadingType: number = 0 // PDF = 1 ; Excel = 2

  /* Form para los campos del contenido (COMPROBANTES) de la caja */
  public contenidoForm = this.fb.group({
    caja: [''],
    tipo: [''],
    clave: [''],
    fecha: [''],
    correlativo: [''],
    tipodefault: [''],
    clavedefault: [''],
    fechadefault: [''],
  });

  constructor(
    private fb: FormBuilder,
    private cajaService: CajaService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

/*  /!* Funcion para fijar los campos  *!/
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
  }*/

  inputChange() {
    // Copia el valor de tipodefault a tipo cuando tipodefault cambia
    this.contenidoForm.get('tipo')?.setValue(this.contenidoForm.get('tipodefault')?.value ?? '');
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

    this.contenidoForm.get('tipodefault')?.valueChanges.subscribe(value => {
      if (value) {
        this.contenidoForm.get('tipo')?.disable();
      } else {
        this.contenidoForm.get('tipo')?.enable();
      }
    });

    this.contenidoForm.get('clavedefault')?.valueChanges.subscribe(value => {
      if (value) {
        this.contenidoForm.get('clave')?.disable();
      } else {
        this.contenidoForm.get('clave')?.enable();
      }
    });

    this.contenidoForm.get('fechadefault')?.valueChanges.subscribe(value => {
      if (value) {
        this.contenidoForm.get('fecha')?.disable();
      } else {
        this.contenidoForm.get('fecha')?.enable();
      }
    });

    // Se suscribe para detectar cada vez que la variable $refreshTable cambie
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
          usuario: resp.caja.usuario || '',
        });

        if(resp.from === 'update')
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
              usuario: resp.caja.usuario ||'',
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
        console.log(this.contenidoForm.value);
        console.log(resp);

        /* mensaje de exito */
        this.exito(resp);
      },
      (err) => {
        console.log(this.contenidoForm.value);
        console.log('Valor de "tipo" a enviar:', this.contenidoForm.get('tipo')?.value);
        console.warn(err.error.msg);

        /* Mensaje de error */
        this.error(err);
      }
    );
  }


  /*Funcion para generar el reporte PDF*/
  generatePDF(){
    if(this.hasBox() == false){
      return
    }

    const codigo : string = this.cajaForm.value.codigo || ''

    this.generando = 1 // Mostrar el gif de "Generando.."
    this.loadingType = 1 // Se está genrando un PDF

    this.cajaService.getPDF(codigo)
    .then(response => response.blob())
    .then(pdf => {
      window.open(URL.createObjectURL(pdf), '_blank');
      this.generando = 0
      this.loadingType = 0
    })
    .catch(err => {
      console.log(err);
      this.toastr.error('Ha ocurrido un error al generar el reporte en PDF: ' + err, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      this.generando = 0
      this.loadingType = 0
    });
  }

  generateXLSX(){
    if(this.hasBox() == false){
      return
    }

    const codigo : string = this.cajaForm.value.codigo || ''

    this.generando = 1 // Mostrar el gif de "Generando.."
    this.loadingType = 2 // Se está genrando un PDF

    this.cajaService.getXLSX(codigo)
    .then(response => response.blob())
    .then(xlsx => {
      window.open(URL.createObjectURL(xlsx), '_blank');
      this.generando = 0
      this.loadingType = 0
    })
    .catch(err => {
      console.log(err);
      this.toastr.error('Ha ocurrido un error al generar el reporte en PDF: ' + err, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      this.generando = 0
      this.loadingType = 0
    });
  }

  cargarQuedan(): void {
    if(this.hasBox() == false){
      return
    }

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
          caja: code,
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

      this.generando = 1 // Mostrar el gif de "Generando.."
      this.loadingType = 3 // Se está genrando un PDF

      this.cajaService.deleteOneContent(codigo, newArray)
      .subscribe((res:any) => {

        this.hideDeleteGif(res.msg)
        // Swal.fire(res.msg, 'Completado')

        this.cargarCaja()
      }, (err)=> {
          console.warn(err)
          this.toastr.error('No se ha podido quitar el comprobante ' + err.msg, '', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'decreasing',
            positionClass: 'toast-top-right',
          });

          this.generando = 0
          this.loadingType = 0
      })
    }
  }

  async vaciarCaja(){
    if(this.hasBox() == false){
      return
    }

    const codigo = this.cajaForm.value.codigo || ''

    const { isConfirmed } = await Swal.fire({
      title: '¿Borrar todo el Contendo de la Caja '+ codigo +'?',
      showCancelButton: true
    })

    if (isConfirmed) {
      this.generando = 1
      this.loadingType = 3

      this.cajaService.deleteAllContent(codigo)
      .subscribe((res:any) => {

        this.hideDeleteGif(res.msg)
        // Swal.fire('La caja ' + codigo + ' ahora está Vacia', 'Completado')

        this.cargarCaja()
      }, (err)=> {
          console.warn(err)
          this.toastr.error('No se ha podido vaciar la caja', '', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'decreasing',
            positionClass: 'toast-top-right',
          });
          this.generando = 0
          this.loadingType = 0
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

  hasBox(){
    // Asegurarse de tener cargada una caja antes de ejecutar acciones sobre ella
    const {codigo, descripcion, estante, nivel, caducidad, grupo} = this.cajaForm.value;

    if (!codigo || !descripcion || !estante || !nivel || !caducidad || !grupo) {
      console.error('No hay una caja caragada');
      this.toastr.error('Se debe seleccionar una caja para generar ejecutar ésta acción', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      return false;
    } else {
      return true
    }
  }


  upperCase(){
    let val = this.cajaForm.value.codigo || ''

    this.cajaForm.setValue({
      codigo: val.toUpperCase(),
      descripcion: this.cajaForm.value.descripcion || '',
      caducidad: this.cajaForm.value.caducidad || '',
      grupo: this.cajaForm.value.grupo || '',
      estante: this.cajaForm.value.estante || '',
      nivel: this.cajaForm.value.nivel || '',
      numero: this.cajaForm.value.numero || '',
      usuario: this.cajaForm.value.usuario || ''
    })
  }

  hideDeleteGif(msg: string){
    setTimeout(()=>{
      this.generando = 0
      this.loadingType = 0

      this.toastr.success(msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });

    },1000)
  }

}
