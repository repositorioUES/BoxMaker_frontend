import { Component } from '@angular/core';
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
export class LoginComponent {

  public loginForm = this.fb.group({
    userName: ["", ],
    password: ["archivo", ],
  });

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private snack: MatSnackBar) { }

  login() {
    this.authService.login(this.loginForm.value)
      .subscribe(resp => {
      
        this.router.navigateByUrl('/auth/admin');

        this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd && this.router.url === '/') {
            window.location.reload();
          }
        });

        this.snack.open('Bienvenido', 'Aceptar', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
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
}
