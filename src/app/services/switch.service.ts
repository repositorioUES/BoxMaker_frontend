import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

  export class SwitchService {
  
    //Observable que emitirá cada ve que cambie el valor de $switch
    $switch = new EventEmitter<any>();
}