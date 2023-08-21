import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  public loginForm = this.fb.group({
    userName: ["CGARCIA", [Validators.required]],
    password: ["archivo", [Validators.required]],
  });

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,private snack:MatSnackBar){}


  login(){

    this.authService.login( this.loginForm.value )
    .subscribe( resp => {
      this.snack.open('Bienvenido', 'Aceptar', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });
      // Navegar al Dashboard
      this.router.navigateByUrl('/');

    }, (err) => {
      this.snack.open(err.error.msg, 'Aceptar', {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
      });

    });

}

}
