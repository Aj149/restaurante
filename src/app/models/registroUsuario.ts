import { Platos } from "./dashboard";

export class Usuarios{
    id? : number = 0;
    nombre : string = "";
    apellido : string = "";
    email : string = "";
    password : string = "";
    telefono : string = "";
    direccion : string = "";
    platos: Platos[] = [];
}
