import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';
import { SwitchService } from 'src/app/services/switch.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})

export class AdministradorComponent implements OnInit {

  constructor(private adminSrv: AdminService, private dialog: MatDialog){}

  userId: string = "";
  userName: string = "";

  usuarios: Usuario[] = []

  displayedColumns: string[] = ['Permisos', 'Nombre', 'Nombre de Usuario', 'Fec. Creación', 'Estado','Bloqueo', 'Contraseña', 'Eliminar'];
  
  ngOnInit(): void {
    this.cargarUsuarios()

    // Suscribirse al observer para escuchar el "valor" que nos mande el id del usuairo
    this.adminSrv.$userId.subscribe((id)=>{this.userId = id})
    // Suscribirse al observer para escuchar el "valor" que nos mande el nombre del usuairo
    this.adminSrv.$userName.subscribe((nombre)=>{this.userName= nombre})
  }
  
  cargarUsuarios(){
    this.adminSrv.getUsers()
    .subscribe((resp:any) => {
      this.usuarios = resp.result
    }, (err)=> {
      console.warn(err) 
    })
  }

  async deleteUser(id: string, userName: string){
    const { isConfirmed } = await Swal.fire({
      title: '¿Borrar al Usuario '+ userName +'?',
      showCancelButton: true
    })

    if (isConfirmed) {
      this.adminSrv.deleteUser(id)
      .subscribe((res:any) => {
        Swal.fire(res.msg + ' ' + userName, 'Completado')
        this.cargarUsuarios()
      }, (err)=> console.warn(err))
    }
  }


  async resetPassword(id: string, userName: string){
    const { isConfirmed } = await Swal.fire({
      title: '¿Resetear la contraseña del Usuario "'+ userName +'"?',
      showCancelButton: true
    })

    if (isConfirmed) {
      this.adminSrv.resetPassword(id)
      .subscribe((res:any) => {
        Swal.fire(res.msg, 'Completado')
        this.cargarUsuarios()
      }, (err)=> console.warn(err))
    }
  }

  changeState(id: string){
    this.adminSrv.changeState(id)
    .subscribe((res:any) => {
      Swal.fire(res.msg, 'Completado')
      this.cargarUsuarios()
    }, (err)=> console.warn(err))
  }

  unlock(id: string){
    this.adminSrv.unlock(id)
    .subscribe((res:any) => {
      Swal.fire(res.msg, 'Completado')
      this.cargarUsuarios()
    }, (err)=> console.warn(err))
  }

openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
  this.dialog.open(DialogComponent, {
    width: '400px',
    enterAnimationDuration,
    exitAnimationDuration,
  });
}

// openModal(){
//   this.modalSwitch = true;
//   console.log(this.modalSwitch)
// }

}
