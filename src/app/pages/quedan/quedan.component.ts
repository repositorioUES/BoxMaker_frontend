
import { Component, Inject } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  ]
})

export class QuedanComponent {

  constructor(
    public dialogRef: MatDialogRef<QuedanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private adminSrv: AdminService,
    private snack: MatSnackBar,
    private fb: FormBuilder
  ) {}
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  getQuedan(codigo: string){
    console.log(codigo);
    
  }

}