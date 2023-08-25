import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router,NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from "@angular/material/snack-bar";
import { timeInterval } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public loginForm = this.fb.group({
    userName: ["cgarcia", ],
    password: ["archivo", ],
  });

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.init() // Disparar al terminar de cargar el componente
  }


  login() {
    this.authService.login(this.loginForm.value)
      .subscribe(resp => {

        const loggedUser = resp.username
        if(loggedUser.toLowerCase() == 'admin')
          this.router.navigateByUrl('/auth/admin-lobby');
        else
          this.router.navigateByUrl('/');

        // this.router.events.subscribe(event => {
        //   if (event instanceof NavigationEnd && this.router.url === '/') {
        //     window.location.reload();
        //   }
        // });


        // Navegar al Dashboard
        // Suscripción al evento NavigationEnd

      }, (err) => {
        console.warn(err.error.msg);
        this.snack.open(err.error.msg, 'Error', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
      });
  }






  // Crear al ADMIN-GOD si no existe un user con tipo = 0
  init(){
    this.authService.init()
    .subscribe((resp:any) => {
        this.snack.open(resp.msg, 'Aceptar', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      })
    }, (err)=> {
        console.warn(err) 
        this.snack.open(err.error.msg, 'Error', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      })
    })
  }

}
