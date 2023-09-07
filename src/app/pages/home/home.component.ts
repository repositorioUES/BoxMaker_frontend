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

export interface compData {
  codigo: string,
  tipo: string,
  clave: string,
  fecha: string,
  tipoFixed: string,
  claveFixed: string,
  fechaDia: string,
  fechaResto: string,
  correlativo: string,
}

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
  public longitud: number = 0 //cuántos contenidos se recuperaron del JSON
  public cantidad: number = 0 //cuántos contenidos se recuperaron de la BD

  public generando: number = 0//   1 = Se está generando algun documento y por tanto, mostrar el loader;   0 = nada
  public loadingType: number = 0 // PDF = 1 ; Excel = 2
  public unsaved: boolean = false // hay cambios sin guardar?
  public fixed: boolean = false// definir si usar los valores fijos o no

  public comprob: compData = {
    codigo: '',
    tipo: '',
    clave: '',
    fecha: '',
    tipoFixed: '',
    claveFixed: '',
    fechaDia: '',
    fechaResto: '',
    correlativo: '',
  }

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
          this.cargarCaja('guardar')//desde que funcion ejecutamos el cargarCaja
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

            // cargar los contenidos solo si se busca la caja manualmente o si no es un refresco depues de borrar
            if(from != 'borrado' && from != 'guardar')
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
    // Podemos ejecutar solo si tenemos una caja cargada
    if(this.hasBox() == false){
      return
    }

    let fechaFinal = this.comprob.fecha
    if (this.fixed) {
      const tempResto = this.comprob.fechaResto.split("/") //Formatear la fecha con guiones pues tiene "/"
      fechaFinal = tempResto[1] + "-" + tempResto[0] + "-" + this.comprob.fechaDia
    }
 
    // Preparar el objeto que se mandará
    const toSend = {
      caja: this.cajaForm.value.codigo,
      tipo: (this.fixed ? this.comprob.tipoFixed : this.comprob.tipo),
      clave: (this.fixed ? this.comprob.claveFixed : this.comprob.clave),
      fecha: fechaFinal,
      correlativo: this.comprob.correlativo,
    }

    // Podemos ejecutar solo si tenemos todos los datos necesarios
    if(this.hasAllData(toSend) == false){
      return
    }

    this.cajaService.ingresarComprobantes(toSend)
    .subscribe((resp: any) => {
        this.cargarContenidos() // recargasmo la tabla

        if (this.fixed) { // en "Fijado" no spasamos al dia
          document.getElementById('dia')?.focus();
          this.comprob.fechaDia = '' // vaciar los inputs que se vean a reutilizar
          this.comprob.correlativo = ''
        } else {  // En "Normal" nos pasamos al tipo
          document.getElementById('tipo')?.focus(); // Hacer focus al primer imput para volver a ingresar
          this.comprob.tipo = ''     
          this.comprob.clave = ''       //  vaciar los inputs que se vean a reutilizar
          this.comprob.fecha = ''       // que en el llenado manual son todos
          this.comprob.correlativo = '' 
        }

        this.unsaved = true // Hay cambios sin guadar en la BD

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
    
    if (this.fixed) {
      //verificar la fecha contruida a partir de los 2 campos separados
      var fechaf = data.fecha.split("-");
      var day = fechaf[2];
      var month = fechaf[1];
      var year = fechaf[0];
      var date = new Date(year, month, 0);

      if(( day - 0) > (date.getDate() -0)){
          errMsg.push('La Fecha ' + data.fecha + ' No tiene formato válido') 
      }
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
  }

  upperCaseComp(text: string, input: string){
    if (input == 'clave' || input == 'claveFija') {
      this.comprob.clave = text.toUpperCase()
      this.comprob.claveFixed = text.toUpperCase()
    }
  }

  numbersOnly(key: number){
    if(key==8) // borrador.
      return true;
    else if(key >= 48 && key <= 57) // ASCCI de los numeros
      return true;
    else  // el resto de teclas
      return false;
  }

  formatPartialDate(date: string){
 
    if(parseInt(date.substring(0, 2)) < 1 || parseInt(date.substring(0, 2)) > 12){
      this.toastr.error('El Mes debe ser mínimo 01 y máximo 12', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      document.querySelector('#fechaFija')?.classList.add('class', 'input--err')
      return false
    }

    if(this.comprob.fechaResto.includes("/")){
      if(/^[0-9]{2}[/][0-9]{4}$/.test(date)){
        document.querySelector('#fechaFija')?.classList.remove('class', 'input--err')
        return true
      }
    }

    if(this.comprob.fechaResto.length != 6){
      this.toastr.error('El Mes y Año no tienen el formato correcto: Ej. "12/2023"', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      document.querySelector('#fechaFija')?.classList.add('class', 'input--err')
      return false
    }

    document.querySelector('#fechaFija')?.classList.remove('input--err')
    const fecha = date.substring(0, 2) + '/' + date.substring(2, date.length)
    this.comprob.fechaResto = fecha
    return
  }

  formatDay(day: string){
    if(/^[0-9]{2}$/.test(day) == false){
      this.toastr.error('El Día no tiene el formato correcto: Ej. "01"', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      document.querySelector('#dia')?.classList.add('class', 'input--err')
      return
    }
    
    if(parseInt(day) < 1 || parseInt(day) > 31){
      this.toastr.error('El Día debe ser mínimo 1 y máximo 31', '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
      document.querySelector('#dia')?.classList.add('class', 'input--err')
      return
    }

    document.querySelector('#dia')?.classList.remove('class', 'input--err')
  }

  autoCompletar(key: any){
    let autoTipo = ''
    let autoClave = ''
    console.log(key);
    

    if (key == 69) {
      autoTipo = 'EGRESO'

    }

    if (key == 68) {
      autoTipo = 'DIARIO'
      autoClave = 'XX'
    }

    if (key == 73) {
      autoTipo = 'INGRESO'

    }
    
    this.comprob.tipo = autoTipo
    this.comprob.tipoFixed = autoTipo
    this.comprob.clave = autoClave
    this.comprob.claveFixed = autoClave
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
      if(this.fixed){
        if (next == 'dia') {
          if(this.formatPartialDate(this.comprob.fechaResto)){
            document.getElementById(next)?.focus();
            return
          }
        }

        if (next == 'correlativo') {
          if(this.formatPartialDate(this.comprob.fechaResto)){
            this.formatDay(this.comprob.fechaDia)
            return
          }
        }
      }

      document.getElementById(next)?.focus();
  }

  toggleFields(){
    this.fixed = !this.fixed
  }

}
