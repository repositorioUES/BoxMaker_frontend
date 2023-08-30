
import { Component, Inject } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuedanService } from 'src/app/services/quedan.service';
import { Dialog } from '@angular/cdk/dialog';
import { Comprobante } from 'src/app/models/comprobante.model';

export interface DialogData {
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
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})

export class QuedanComponent {

  constructor(
    public dialogRef: MatDialogRef<QuedanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private quedanSrv: QuedanService,
    private snack: MatSnackBar,
    private fb: FormBuilder
  ) {}
  
  comprobantes: Comprobante[] = [] // Todos los usuarios

  onNoClick(): void {
    this.dialogRef.close();
  }

  getQuedan(quedan: string, fInicio: string, fFinal: string){
    const data = {
      fInicio: fInicio,
      fFinal: fFinal,
      quedan: quedan
    }

    this.quedanSrv.getQuedan(data)
    .subscribe((resp:any) => {
      this.comprobantes = resp
      console.log(resp);
      
    }, (err)=> {
      console.warn(err) 
      this.snack.open(err.error.msg, 'Error', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
    })
    
  }

}