export class Comentarios{
    id_comentario?: number;
    nombre: string;
    email: string;
    comentario: string;
    constructor(nombre:string, email: string, comentario: string){
        this.nombre = nombre;
        this.email = email;
        this.comentario = comentario;
    }
}