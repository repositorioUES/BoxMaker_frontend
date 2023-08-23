import { Component } from '@angular/core';
import { SwitchService } from 'src/app/services/switch.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: [
    './modal.component.css'
  ]
})
export class ModalComponent {
  constructor (private switchSrv: SwitchService){}

  
  closeModal(){
    //Emitimos el valor "false" para que lo capture $switch
    this.switchSrv.$switch.emit(false)
  }
}
