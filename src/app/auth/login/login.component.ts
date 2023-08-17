import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  miFormulario: FormGroup = this.fb.group({
    userName: ["CGARCIA", [Validators.required]],
    password: ["archivo", [Validators.required]],

  });
  

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,private snack:MatSnackBar){}

  ngOnInit(): void {
    
  }

  login(){


    
  }

}
