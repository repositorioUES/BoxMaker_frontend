import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
    primerNombre: ["carlos", Validators.required],
    segundoNombre: ["carlos", Validators.required],
    primerApellido: ["carlos", Validators.required],
    segundoApellido: ["carlos", Validators.required],
    email: ["carlos@gmail.com", [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder,private usuarioService: UsuarioService, private router: Router){}

  crearUsuario(){
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if ( this.registerForm.invalid ) {
      return;
    }

    /** Realizar el posteo del formulario */
    this.usuarioService.crearUsuario(this.registerForm.value)
        .subscribe( resp => {
          console.log('usuario creado');
          console.log(resp);
          
          

        },(err) => console.warn(err));
    
  }

}
