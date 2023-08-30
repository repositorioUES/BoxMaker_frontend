import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { interval } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario = (localStorage.getItem('usuario') || '').replace(/"/g, '')
  currentTime!: Date;

  isLoggedIn = false;

  constructor(private authService : AuthService,  private router: Router) {}

  logout(){
    this.authService.logout();
    this.usuario = "";
  }

  ngOnInit(): void {

    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.loginStatusSubjec.asObservable().subscribe(
      data => {
        this.isLoggedIn = this.authService.isLoggedIn();
      }
    )

    interval(1000).subscribe(() => {
      this.currentTime = new Date();
    });

  }

}
