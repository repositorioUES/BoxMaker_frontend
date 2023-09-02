
import { Component, EventEmitter, Inject, Output } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, NgForOf, NgFor, NgIf } from '@angular/common';
import { CajaService } from 'src/app/services/caja.service';


export interface DialogData {
  index: number;
  codigo: string;
  tipo: string;
  clave: string;
  fecha: string;
  correlativo: string;
}

@Component({
  selector: 'app-insertar',
  templateUrl: './insertar.component.html',
  styleUrls: [],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatCheckboxModule, DatePipe, NgForOf, NgFor, NgIf],
})
export class InsertarComponent {

  constructor(
    public dialogRef: MatDialogRef<InsertarComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: DialogData, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private toast: ToastrService,
    private cajaSrv: CajaService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  insertarDebajo(data: DialogData){
    console.log(data);
      
      this.cajaSrv.ingresarComprobantes(data)
      .subscribe((res:any) => {
        if(res.satus == 400){
          this.toast.error(res.msg, '', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'decreasing',
            positionClass: 'toast-top-right',
          });
        } else {
          this.toast.success(res.msg, '', {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: 'decreasing',
            positionClass: 'toast-top-right',
          });
        }

        this.cajaSrv.$refreshTable.next(true); //Emitir que se debe refrescar la tabla del home.component
        this.onNoClick() // cerrar dialog depues de trasladar
      }, (err)=> {
        console.warn(err) 
        console.log(typeof(err.error));
        
        let msg = ''
        if(err.error)
          msg = err.error.msg
        else
          msg = err.error[0].msg

        this.toast.error(msg, '', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-top-right',
        });
      })
  }


  autoCompletarTipo(key: any){
    this.datos.tipo = ''

    if (key == 69) {
      this.datos.tipo = 'EGRESO'
    }

    if (key == 73) {
      this.datos.tipo = 'INGRESO'
    }

    if (key == 68) {
      this.datos.tipo = 'DIARIO'
      this.datos.clave = 'XX'
    }
    
  }

}
