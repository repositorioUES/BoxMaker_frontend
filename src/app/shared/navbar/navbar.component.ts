import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { interval } from 'rxjs';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario = (localStorage.getItem('usuario') || '').replace(/"/g, '')
  currentTime!: Date;

  constructor(private authService : AuthService) {}

  logout(){
    this.authService.logout();
    this.usuario = "";
  }

  ngOnInit(): void {
    interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });
    
  }

}
