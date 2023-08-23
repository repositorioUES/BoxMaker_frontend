import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CajaService } from 'src/app/services/caja.service';
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent {

  public cajaForm = this.fb.group({
    descripcion: ["", ],
  });

constructor(private fb: FormBuilder, private cajaService: CajaService, private snack: MatSnackBar){}

crearCaja(){

  this.cajaService.crearCaja(this.cajaForm.value)
  .subscribe(resp => {
    console.log(resp);
    

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

