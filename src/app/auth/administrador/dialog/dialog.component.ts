import {Component, INJECTOR, Input, OnInit} from '@angular/core';
import { MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { AdminService } from 'src/app/services/admin.service';
import { Permiso } from 'src/app/models/permiso.model';
import { NgFor, NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, NgFor, NgIf],
})

export class DialogComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<DialogComponent>, private adminSrv: AdminService, private snack: MatSnackBar) {}

  public checkSwitch: boolean = false


  ngOnInit(): void {
 
  }


  
}
