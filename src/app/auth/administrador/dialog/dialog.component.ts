
import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';

export interface DialogData {
  userName: string;
  primerNombre: string; 
  segundoNombre:string;
  primerApellido: string;
  segundoApellido: string; 
  email: string; 
  passCaducidad: string;
  _id: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private adminSrv: AdminService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  upadateUser(){
    // this.adminSrv.updateUser(),

  }
}
