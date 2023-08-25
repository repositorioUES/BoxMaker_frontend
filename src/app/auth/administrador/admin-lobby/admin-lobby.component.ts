import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-lobby',
  templateUrl: './admin-lobby.component.html',
  styles: [
  ]
})
export class AdminLobbyComponent implements OnInit{

  constructor(private router: Router){}
  
  ngOnInit(): void {
    this.router.navigateByUrl('/auth/admin');
  }

}
