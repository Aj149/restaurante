export class reserva{
    id_reserva?: number;
    nombre: string;
    email: string;
    telefono: number;
    lugar: string;
    n_personas: number;
    fecha: Date;
    hora: string;
    
    constructor(nombre:string, email: string, telefono: number, lugar: string, n_personas: number, fecha: Date, hora: string){
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.lugar = lugar;
        this.n_personas = n_personas;
        this.fecha = fecha;
        this.hora = hora;
    }
}