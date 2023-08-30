
import { Component, Inject } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuedanService } from 'src/app/services/quedan.service';
import { Dialog } from '@angular/cdk/dialog';
import { Comprobante } from 'src/app/models/comprobante.model';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, NgForOf, NgFor, NgIf } from '@angular/common';


export interface DialogData {
  codigo: string;
  fInicio: string;
  fFinal: string;
  quedan: string;
}

@Component({
  selector: 'app-quedan',
  templateUrl: './quedan.component.html',
  styleUrls: [
    './quedan.component.css'
  ],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatCheckboxModule, DatePipe, NgForOf, NgFor, NgIf],
})

export class QuedanComponent {

  constructor(
    public dialogRef: MatDialogRef<QuedanComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: DialogData, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private quedanSrv: QuedanService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {}
  
  elegidos: any[] = [] // Comprobantes seleccionados en el modal
  mainChecked: boolean = true
  checked: boolean = true

  onNoClick(): void {
    this.dialogRef.close();
  }

  getQuedan(quedan: string, fInicio: string, fFinal: string){
    // const datos = {
    //   fInicio: fInicio,
    //   fFinal: fFinal,
    //   quedan: quedan
    // }
    const datos = {
      fInicio: '2019-01-01',
      fFinal: '2019-01-31',
      quedan: '123456'
    }

    this.quedanSrv.getQuedan(datos)
    .subscribe((resp:Comprobante[]) => {
      this.elegidos = []
      resp.forEach(comprobante => {
        const compAux = {
          comprobante: comprobante,
          marked: true
        }
        this.elegidos.push(compAux)
      });
    }, (err)=> {
      console.warn(err) 
      this.toast.error(err.error.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    })
    
  }
  
  selectedItems(comp: any){
    
    this.elegidos.forEach(e => {
      if (e.comprobante._id == comp.comprobante._id) {
        e.marked = !e.marked
      }
    })

    if (this.getMarks() == this.elegidos.length) {
      this.mainChecked = true
      console.log('toos');
    } else {
      console.log('No toos');
      this.mainChecked = false
    }

    this.sh()
  }

  sh(){
    let toSave: Comprobante[] = [] //Comprobantes seleccionados que se guardarán
    this.elegidos.forEach(e => {
      if (e.marked) {
        toSave.push(e.comprobante)
      }
    });
    console.log(toSave.length);
  }

  toggleAll(){

    if (this.getMarks() == this.elegidos.length) {
        this.elegidos.forEach(e => {
          e.marked = false
        })
        this.checked = false
    } else {
      this.elegidos.forEach(e => {
        e.marked = true
      })
      this.checked = true
    }
    this.sh()
  }

  trasladar(codigo: string){
    let toSave: Comprobante[] = [] //Comprobantes seleccionados que se guardarán

    this.elegidos.forEach(e => {
      if (e.marked) {
        toSave.push(e.comprobante)
      }
    });

    this.quedanSrv.saveQuedan(codigo, toSave)
    .subscribe((res:any) => {
      this.toast.success(res.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    }, (err)=> {
      console.warn(err) 
      this.toast.error(err.error.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    })
    
  }

  getMarks(){
    let marked = 0 // Cantidad de filas marcadas

    this.elegidos.forEach(e => {
      if (e.marked) {
        marked++
      }
    })

    return marked
  }

}