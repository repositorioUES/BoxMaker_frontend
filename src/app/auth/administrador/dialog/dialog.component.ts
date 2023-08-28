
import { Component, Inject } from '@angular/core';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private adminSrv: AdminService,
    private snack: MatSnackBar
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  upadateUser(id: string, pn: string, sn: string, pa: string, sa: string){
    
    const data = ({
      primerNombre: pn,
      segundoNombre: sn,
      primerApellido: pa,
      segundoApellido: sa,
    })

    this.adminSrv.updateUser(id, data)
    .subscribe((resp:any) => {
      this.snack.open(resp.msg, 'Completado', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
    }, (err)=> {
        console.warn(err) 
        this.snack.open(err.error.msg, 'Error', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
    })
    this.dialogRef.close();

  }
}
