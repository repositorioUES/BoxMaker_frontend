import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-lobby',
  templateUrl: './admin-lobby.component.html',
  styleUrls: ['./admin-lobby.component.css']
})
export class AdminLobbyComponent implements OnInit{

  constructor(private router: Router){}
  
  iconNumber: number = 0

  ngOnInit(): void {
  
  }

  toUsers(){
    this.router.navigateByUrl('/auth/admin');
  }

  toDefineBox(){
    this.router.navigateByUrl('/');
  }

  toBoxes(){
    this.router.navigateByUrl('/auth/cajas');
  }

  showIcon(icon: string){

    if (icon == 'users') {
      this.iconNumber = 1
    }
    if (icon == 'contents') {
      this.iconNumber = 2
    }
    if (icon == 'boxes') {
      this.iconNumber = 3
    }
    
    if (icon == 'admin') {
      this.iconNumber = 4
    }
  }

  celIcon(){
    this.iconNumber = 0
  }

}
