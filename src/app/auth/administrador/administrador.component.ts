import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from './dialog/dialog.component';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})

export class AdministradorComponent implements OnInit {

  public loading: boolean // mostrar el icono de cargar
  constructor(private adminSrv: AdminService, private dialog: MatDialog, private snack: MatSnackBar, ){
    this.loading = true
  }

  usuarios: Usuario[] = [] // Todos los usuarios
  dataSource = new MatTableDataSource(this.usuarios);
  
  displayedColumns: string[] = ['Admin', 'Nombre', 'Nombre de Usuario', 'Fec. Creación', 'Estado','Bloqueo', 'Contraseña', 'Editar', 'Eliminar'];
  
  ngOnInit(): void {
    this.cargarUsuarios()
    this.hideLoader()
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  cargarUsuarios(){
    this.adminSrv.getUsers()
    .subscribe((resp:any) => {
      this.usuarios = resp.result
      this.dataSource = new MatTableDataSource(this.usuarios);
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
          _id: id,
          tipo: usuario.tipo
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

  hideLoader(){

    setTimeout(()=>{
      document.querySelector(".loader")?.classList.add("loader--hidden")
    },1500)

  }

}

