import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Caja } from 'src/app/models/caja.model';
import { CajaService } from 'src/app/services/caja.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styleUrls: ['./cajas.component.css']
})
export class CajasComponent {

  
  constructor (private cajaSrv: CajaService, private dialog: MatDialog, private toast: ToastrService,){}
  
  cajas: Caja[] = [] // Todos los Cajas
  displayedColumns: string[] = ['N°', 'Codigo', 'Descripcion', 'Fec. Creacion', 'PDF', 'Excel', 'Editar', 'Eliminar'];
  public generando: number = 0//Se está cargando alguna opcion y mostrar el loader
  public docType: number = 0 // PDF = 1 ; Excel = 2
  
  ngOnInit(): void {
    this.cargarCajas()
    this.hideLoader()
  }


  cargarCajas(){
    this.cajaSrv.getBoxes()
    .subscribe((resp:any) => {
      this.cajas = resp.result

      this.toast.success(resp.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    }, (err)=> {
      console.warn(err) 
      this.toast.error(err.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    })
  }

  generatePDF(codigo: string){
    this.generando = 1 // Mostrar el gif de "Generando.."
    this.docType = 1 // Se está genrando un PDF

    this.cajaSrv.getPDF(codigo)
    .then(response => response.blob())
    .then(pdf => {
      window.open(URL.createObjectURL(pdf), '_blank');
      this.generando = 0
      this.docType = 0
    })
    .catch(err => {
      console.log(err);
      this.toast.error('Ha ocurrido un error al generar el reporte en PDF: ' + err, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    });
  }

  generateXLSX(codigo: string){
    this.generando = 1 // Mostrar el gif de "Generando.."
    this.docType = 2 // Se está genrando un PDF

    this.cajaSrv.getXLSX(codigo)
    .then(response => response.blob())
    .then(xlsx => {
      window.open(URL.createObjectURL(xlsx), '_blank');
      this.generando = 0
      this.docType = 0
    })
    .catch(err => {
      console.log(err);
      this.toast.error('Ha ocurrido un error al generar el reporte en PDF: ' + err, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    });
  }

  async deleteBox(codigo: string){
    const { isConfirmed } = await Swal.fire({
      title: '¿Borrar la Caja '+ codigo +'?',
      showCancelButton: true
    })

    if (isConfirmed) {
      this.cajaSrv.deleteBox(codigo)
      .subscribe((res:any) => {
        Swal.fire(res.msg, 'Completado')
        this.cargarCajas()
      }, (err)=> {
        console.log(err);
        this.toast.error(err.msg, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
      })
    }
  }

  openDialog(){

  }


  hideLoader(){

    setTimeout(()=>{
      document.querySelector(".loader")?.classList.add("loader--hidden")
    },1500)

  }

}
