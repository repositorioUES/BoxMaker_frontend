import { Component, EventEmitter, Output } from '@angular/core';
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
    primerNombre: ["",],
    segundoNombre: ["",],
    primerApellido: ["",],
    segundoApellido: ["",]
  });

  @Output() private usuarioAgregado = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router, private snack: MatSnackBar) { }

  crearUsuario() {
    this.formSubmitted = true;
    // console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }

    /** Realizar el posteo del formulario */
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp => {
        this.snack.open('Usuario guardado con exito', 'Aceptar', {
          duration: 7000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
        // Navegar al Dashboard
        // this.router.navigateByUrl('/auth/admin');
        this.usuarioAgregado.emit(true)

      }, (err) => {
        this.snack.open(err.error.msg, 'Error', {
          duration: 7000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });

      });

  }

}
