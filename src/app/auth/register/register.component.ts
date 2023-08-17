import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public registerForm = this.fb.group({
    primerNombre: ["Christian", [Validators.required]],
    segundoNombre: ["Alberto", [Validators.required]],
    primerApellido: ["Garcia", [Validators.required]],
    segundoApellido: ["Ordonez", [Validators.required]],
    email: ["christian@gmail.com", [Validators.required]],

  });

  constructor(private fb: FormBuilder){}

  crearUsuario(){
    console.log(this.registerForm.value);
    
  }

}
