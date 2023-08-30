

export class Comprobante {
    constructor(
       public quedan: string, 
       public tipo: string, 
       public clave: string, 
       public fecha: string, 
       public correlativo: string, 
    ) {}
}