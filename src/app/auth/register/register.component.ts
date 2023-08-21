import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    primerNombre: ["", Validators.required],
    segundoNombre: ["", Validators.required],
    primerApellido: ["", Validators.required],
    segundoApellido: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router, private snack: MatSnackBar) { }

  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }

    /** Realizar el posteo del formulario */
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp => {
        this.snack.open('Usuario guardado con exito', 'Aceptar', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
        // Navegar al Dashboard
        this.router.navigateByUrl('/login');


      }, (err) => {
        this.snack.open(err.error.msg, 'Aceptar', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });

      });

  }

}
