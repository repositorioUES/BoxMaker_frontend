import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from './dialog/dialog.component';


@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})

export class AdministradorComponent implements OnInit {

  constructor(private adminSrv: AdminService, private dialog: MatDialog, private snack: MatSnackBar, ){}

  userName: string = "";
  
  usuario!: Usuario; // Solo 1
  usuarios: Usuario[] = [] // Todos los usuarios

  displayedColumns: string[] = ['Nombre', 'Nombre de Usuario', 'Fec. Creación', 'Estado','Bloqueo', 'Contraseña', 'Editar', 'Eliminar'];
  
  ngOnInit(): void {
    this.cargarUsuarios()

    // Suscribirse al observer para escuchar el "valor" que nos mande el id del usuairo
    // this.adminSrv.$userId.subscribe((id)=>{this.userId = id})
    // Suscribirse al observer para escuchar el "valor" que nos mande el nombre del usuairo
    this.adminSrv.$userName.subscribe((nombre)=>{this.userName= nombre})
  }

  
  cargarUsuarios(){
    this.adminSrv.getUsers()
    .subscribe((resp:any) => {
      this.usuarios = resp.result
    }, (err)=> {
        console.warn(err) 
        this.snack.open(err.error.msg, 'Error', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
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

  changeState(id: string){
    this.adminSrv.changeState(id)
    .subscribe((res:any) => {
      // Swal.fire(res.msg, 'Completado')
      this.snack.open(res.msg, 'Completado', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
      this.cargarUsuarios()
    }, (err)=> {
        console.warn(err)
        this.snack.open(err.error.msg, 'Error', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
    })
  }

  unlock(id: string){
    this.adminSrv.unlock(id)
    .subscribe((res:any) => {
      // Swal.fire(res.msg, 'Completado')
      this.snack.open(res.msg, 'Completado', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
      this.cargarUsuarios()
    }, (err)=> {
        console.warn(err)
        this.snack.open(err.error.msg, 'Error', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
    })
  }
  
  openDialog(id: string): void {

    this.adminSrv.getUser(id)
    .subscribe((res:any) => {
      const usuario = res.user

      //Abrir el Dialog con la inof
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          userName: usuario.userName,
          primerNombre: usuario.primerNombre,
          segundoNombre: usuario.segundoNombre,
          primerApellido: usuario.primerApellido,
          segundoApellido: usuario.segundoApellido,
          email: usuario.email,
          passCaducidad: usuario.passCaducidad + " (Faltan " + usuario.dias + " días)",
          _id: id
        },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
        this.cargarUsuarios()
      });
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

