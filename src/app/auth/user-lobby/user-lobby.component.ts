import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-lobby',
  templateUrl: './user-lobby.component.html',
  styleUrls: ['./user-lobby.component.css']
})

export class UserLobbyComponent {

  constructor(private fb: FormBuilder, private router: Router, private authSrv: AuthService, private toast: ToastrService) { }

  fakeUser: Usuario =({
    primerNombre: 'Jhon', 
    segundoNombre: 'fake', 
    primerApellido: 'fake', 
    segundoApellido: 'fake', 
    email: 'fake', 
    userName: 'fake', 
    fechaCreacion: 'fake', 
    passCaducidad: 'fake', 
    _id: 'fake', 
    activo: 'fake', 
    bloqueado: 'fake', 
  })

  iconNumber: number = 0
  loggedUser: Usuario = this.fakeUser // Usuario ficticio solo para la inicializacion de datos
  daysLeft: number = 0 // Días restantes hasta que caduque la contraseña
  expiration: string = '' // Mensaje y fecha de vencimiento de contraseña

  ngOnInit(): void {
    this.getProfile()
  }

  getProfile(){

    this.authSrv.profile()
    .subscribe((resp:any) => {
      this.loggedUser = resp.userData
      this.daysLeft = resp.warning.dias
      this.expiration = resp.warning.fecha

    }, (err)=> {
      console.warn(err) 
      this.toast.error(err.msg, '', {
        timeOut: 5000,
        progressBar: true,
        progressAnimation: 'decreasing',
        positionClass: 'toast-top-right',
      });
    })
  }

  toDefineBox(){
    this.router.navigateByUrl('/');
  }

  toBoxes(){
    this.router.navigateByUrl('/auth/cajas');
  }

  showIcon(icon: string){

    if (icon == 'users') {
      this.iconNumber = 1
    }
    if (icon == 'contents') {
      this.iconNumber = 2
    }
    if (icon == 'boxes') {
      this.iconNumber = 3
    }
    
    if (icon == 'admin') {
      this.iconNumber = 4
    }
  }

  celIcon(){
    this.iconNumber = 0
  }
}
