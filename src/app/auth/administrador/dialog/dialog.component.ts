import {Component, OnInit} from '@angular/core';
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
  
  userId: string = "aaaa";
  userName: string = "";

  permisos: Permiso[] = []
  ids: number[] = []
  idsToGrant: number[] = []

  ngOnInit(): void {
    // Suscribirse al observer para escuchar el "valor" que nos mande el id del usuairo
    this.adminSrv.$userId.subscribe((id)=>{this.userId = id})
    
    this.getPermissions()
  }

  getPermissions(){
    this.adminSrv.getPermissions(this.userId)
    .subscribe((resp:any) => {
      this.permisos = resp.result
      this.ids = resp.ids
    },  (err)=> {
        console.warn(err) 
        this.snack.open(err.error.msg, 'Error', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
    })
  }

  grantPermissions(){
    this.adminSrv.grantPermission()
  }

  addToIds(id: number){
    if (this.idsToGrant.includes(id)) {
      let index = this.idsToGrant.indexOf(id)
      this.idsToGrant.splice(index, 1)
    } else {  
      this.idsToGrant.push(id)
    }
    console.log(this.idsToGrant)
  }

  grantDenyAll(){
    if (this.checkSwitch) {
      this.denyAll()
    } else {
      this.grantAll()
    }
  }

  grantAll(){
    let checkBoxes = document.querySelectorAll('.chk')
    this.idsToGrant = []

    checkBoxes.forEach(chk => {
      chk.setAttribute('checked', 'true')
      chk.setAttribute('value','on')
    })

    this.permisos.forEach(per => {
      if (!this.idsToGrant.includes(per._id))
        this.idsToGrant.push(per._id) 
    })
    console.log(checkBoxes)
    this.checkSwitch = true
  }

  denyAll(){
    let checkBoxes = document.querySelectorAll('.chk')

    this.idsToGrant = []

    checkBoxes.forEach(chk => {
      chk.removeAttribute('checked')
      chk.setAttribute('value','0')
    })

    console.log(checkBoxes)
    this.checkSwitch = false
  }
  
}
