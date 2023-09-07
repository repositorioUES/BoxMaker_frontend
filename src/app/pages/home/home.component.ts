import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
    codigo: ['23-AAC-1'],
    caducidad: [''],
    grupo: [''],
    estante: [''],
    nivel: [''],
    numero: [''],
    usuario: [localStorage.getItem('usuario')?.replace(/"+/g,'')],
  });

  /* Inicializar el boton */
  public contenidos: Comprobante[] = [] //Contenido de la caja que está en el txt, NO en la base
  public longitud: number = 0 //cuántos contenidos se recuperaron del JSON
  public cantidad: number = 0 //cuántos contenidos se recuperaron de la BD

  public generando: number = 0//   1 = Se está generando algun documento y por tanto, mostrar el loader;   0 = nada
  public loadingType: number = 0 // PDF = 1 ; Excel = 2
  public unsaved: boolean = false // hay cambios sin guardar?
  @ViewChild('blankInput') blankInput!: ElementRef;

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

  // Se suscribe para detectar cada vez que la variable $refreshTable cambie
  private refresh = this.cajaService.$refreshTable.subscribe(data => {
    if (data == true) {
      this.unsaved = true
      this.cargarContenidos()
    }
});

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

  inputChange(inputId: string) {
    // Copia el valor de tipodefault a tipo cuando tipodefault cambia
    this.contenidoForm.get(inputId)?.setValue(this.contenidoForm.get(inputId + 'default')?.value ?? '');
    // this.contenidoForm.get('clave')?.setValue(this.contenidoForm.get('clavedefault')?.value ?? '');
    // this.contenidoForm.get('fecha')?.setValue(this.contenidoForm.get('fechadefault')?.value ?? '');

    // Convertir el input a MAYÚSCULA
    const inputValue = this.contenidoForm.get(inputId)?.value;
    if (inputValue) {
      this.contenidoForm.get(inputId)?.setValue(inputValue.toUpperCase());
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

    this.contenidoForm.get('tipodefault')?.valueChanges.subscribe(value => {
      if (value) {
        this.contenidoForm.get('tipo')?.setValue('');
      }
    });

    this.contenidoForm.get('clavedefault')?.valueChanges.subscribe(value => {
      if (value) {
        this.contenidoForm.get('clave')?.setValue('');
      }
    });

    this.contenidoForm.get('fechadefault')?.valueChanges.subscribe(value => {
      if (value) {
        this.contenidoForm.get('fecha')?.setValue('');
      }
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

        if(resp.from === 'update'){ // Si la respuesta viene del metodo de "Guardar"
          //Podemos ejecutar solo si tenemos una caja cargada
          if(this.hasBox() == false){
            return
          }
          this.unsaved = false
          this.cargarCaja('')
        }
      },
      (err) => {
        console.warn(err.error.msg);

        /* Mensaje de error */
        this.error(err);
      }
    );
  }

  /* Funcion que permite BUSCAR una caja y CARGAR sus datos en el formulario */
  cargarCaja(from: string) {
    const formData = this.cajaForm.value;
    const codigo = formData.codigo;

    if (codigo) {
      if(from != 'borrado'){
        this.generando = 1
        this.loadingType = 4
      }

      this.cajaService
        .cargarCaja(formData)

        .subscribe(
          (resp: any) => {
            // console.log(this.cajaForm.value.codigo);

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

            this.generando = 0
            this.loadingType = 0

            this.cargarContenidos()

            /* mensaje de exito */
            this.exito(resp);
          },
          (err) => {
            console.warn(err.error.msg);

            this.generando = 0
            this.loadingType = 0

            /* Mensaje de error */
            this.errorCaja();
          }
        );
    } else {
      // Cualquier validacion con codigo
      this.generando = 0
      this.loadingType = 0
    }
  }

  cargarContenidos(){
    //Podemos ejecutar solo si tenemos una caja cargada
    if(this.hasBox() == false){
      return
    }

    const codigo : string = this.cajaForm.value.codigo || ''
    // console.log(codigo);

    this.generando = 1
    this.loadingType = 4

    this.cajaService.cargarContenido(codigo).subscribe(
      (resp: any) => {

        this.contenidos = resp.contenido // Obtener los contenidos del json
        this.longitud =  this.contenidos.length -1
        this.cantidad =  resp.cantidad

        // Si los del JSON != a los de la BD entonces hay cambios sin guardar
        if (this.cantidad != this.contenidos.length)
          this.unsaved = true

        this.generando = 0
        this.loadingType = 0
        /* mensaje de exito */
        this.exito(resp);
      },
      (err) => {
        console.warn(err.error.msg);

        this.generando = 0
        this.loadingType = 0

        /* Mensaje de error */
        this.error(err);
      }
    );
  }

  /* Funcion que permite BUSCAR una caja y CARGAR sus datos en el formulario */
  ingresarComprobantes() {
    //Podemos ejecutar solo si tenemos una caja cargada
    if(this.hasBox() == false){
      return
    }

    //Podemos ejecutar solo si tenemos todos los datos necesarios
    if(this.hasAllData(this.contenidoForm.value) == false){
      return
    }

    this.cajaService.ingresarComprobantes(this.contenidoForm.value).subscribe(
      (resp: any) => {

        this.cargarContenidos() // recargamos la tabla
        // document.getElementById('tipo')?.focus(); // Hacer focus al primer input para volver a ingresar

        if (!this.contenidoForm.get('tipodefault')?.value) { // Limpia el formulario y deja el focus en tipo
          this.contenidoForm.get('tipo')?.reset();
          this.contenidoForm.get('clave')?.reset();
          this.contenidoForm.get('fecha')?.reset();
          this.contenidoForm.get('correlativo')?.reset();
          document.getElementById('tipo')?.focus();
        } else {                                                   // Default esta lleno y solamente limpia el correlativo y deja focus el correlativo
          this.contenidoForm.get('correlativo')?.reset();
          document.getElementById('correlativo')?.focus();
        }

        this.unsaved = true

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


  /*Funcion para generar el reporte PDF*/
  generatePDF(){
    if(this.hasBox() == false){
      return
    }

    const codigo : string = this.cajaForm.value.codigo || ''

    this.generando = 1 // Mostrar el gif de "Generando.."
    this.loadingType = 1 // Se está generando un PDF

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
    //Podemos ejecutar solo si tenemos una caja cargada
    if(this.hasBox() == false){
      return
    }

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
    const codigo = this.cajaForm.value.codigo || ''

    const { isConfirmed } = await Swal.fire({
      title: '¿Quitar éste Comprobante  de la Caja '+ codigo +'?',
      showCancelButton: true
    })

    if (isConfirmed) {

      this.generando = 1 // Mostrar el gif de "Generando.."
      this.loadingType = 3 // Se está generando un PDF

      this.cajaService.deleteOneContent(codigo, index)
      .subscribe((res:any) => {

        this.hideDeleteGif(res.msg)
        // Swal.fire(res.msg, 'Completado')
        this.unsaved = true

        this.cargarContenidos()
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
    //Podemos ejecutar solo si tenemos una caja cargada
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
        this.unsaved = true

        this.cargarContenidos()
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

  guardarContenidos(){
    //Podemos ejecutar solo si tenemos una caja cargada
    if(this.hasBox() == false){
      return
    }

    const codigo = this.cajaForm.value.codigo || ''

    this.generando = 1
    this.loadingType = 5

    this.cajaService.savetoDatabase(codigo)
    .subscribe((res:any) => {

      this.toastr.success('Contenido de la caja ' + codigo +' guardado en la Base de Datos', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      this.unsaved = false
      this.generando = 0
      this.loadingType = 0
    }, (err)=> {
        console.warn(err)
        this.toastr.error('No se ha podido guardar el contenido de la caja', '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
        this.generando = 0
        this.loadingType = 0
    })
  }

  hasBox(){
    // Asegurarse de tener cargada una caja antes de ejecutar acciones sobre ella
    const {codigo, descripcion, estante, nivel, caducidad, grupo} = this.cajaForm.value;

    if (!codigo || !descripcion || !estante || !nivel || !caducidad || !grupo) {
      console.error('No hay una caja caragada');
      this.toastr.error('Se debe seleccionar una caja para ejecutar ésta acción', '', {
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

  hasAllData(data: any){
    let errMsg: any[] = []

    if(!['DIARIO', 'EGRESO','INGRESO'].includes(data.tipo)){
      errMsg.push('El Tipo de Documento No es válido')
    }
    if(/^[A-Z]{1}[0-9,A-Z]{1}$/.test(data.clave) == false){
      errMsg.push('La Clave No tiene un formato válido')
    }

    if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(data.fecha) == false){
      errMsg.push('La Fecha No tiene formato válido')
    }

    if(/^[0-9]{1,5}$/.test(data.correlativo) == false){
      errMsg.push('El N° Comprobante No tiene formato válido')
    }

    if (errMsg.length != 0) {
      errMsg.forEach(err => {
        this.toastr.error(err, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
      });
      return false
    } else {
      return true
    }
  }


  upperCase(){
    let code = this.cajaForm.value.codigo || ''

    this.cajaForm.setValue({
      codigo: code.toUpperCase(),
      descripcion: this.cajaForm.value.descripcion || '',
      caducidad: this.cajaForm.value.caducidad || '',
      grupo: this.cajaForm.value.grupo || '',
      estante: this.cajaForm.value.estante || '',
      nivel: this.cajaForm.value.nivel || '',
      numero: this.cajaForm.value.numero || '',
      usuario: this.cajaForm.value.usuario || ''
    })

    this.contenidoForm.setValue({
      caja: this.contenidoForm.value.caja?.toUpperCase() || '',
      tipo: this.contenidoForm.value.tipo?.toUpperCase() || '',
      clave: this.contenidoForm.value.clave?.toUpperCase() || '',
      fecha: this.contenidoForm.value.fecha || '',
      correlativo: this.contenidoForm.value.correlativo || '',
      tipodefault: this.contenidoForm.value.tipodefault || '',
      clavedefault: this.contenidoForm.value.clavedefault || '',
      fechadefault: this.contenidoForm.value.fechadefault || ''
    })
  }

  autoCompletar(key: any){
    let autoTipo = ''
    let autoClave = this.contenidoForm.value.clave?.toUpperCase() || ''

    if (key == 69) {
      autoTipo = 'EGRESO'
      autoClave = ''
    }

    if (key == 68) {
      autoTipo = 'DIARIO'
      autoClave = 'XX'
    }

    if (key == 73) {
      autoTipo = 'INGRESO'
      autoClave = ''
    }

    this.contenidoForm.setValue({
      caja: this.contenidoForm.value.caja || '',
      tipo: autoTipo,
      clave: autoClave,
      fecha: this.contenidoForm.value.fecha || '',
      correlativo: this.contenidoForm.value.correlativo || '',
      tipodefault: this.contenidoForm.value.tipodefault || '',
      clavedefault: this.contenidoForm.value.clavedefault || '',
      fechadefault: this.contenidoForm.value.fechadefault || ''
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

  nextInput(next: any) {
      document.getElementById(next)?.focus();
  }

}
