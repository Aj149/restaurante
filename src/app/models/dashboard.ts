// 1RESERVACIONES
export class reserva{
    id_reserva?: number=0;
    nombre: string='';
    email: string='';
    telefono: number=0;
    lugar: string='';
    n_personas: number=0;
    fecha: string='';
    hora: string=''; 
}

// 2COMENTARIOS
export class Comentarios{
    id_comentario?: number;
    nombre: string='';
    email: string='';
    comentario: string='';
}

export class Platos{
    id_plato?: number=0;
    nombre: string='';
    descripcion: string='';
    imagen: string='';
    precio: number=0;
}

export class Lugares{
    id_lugar?: number=0;
    nombre: string='';
    descripcion: string='';
    imagen: string='';
    precio: number=0;
    capacidad: number=0;
}



import { JwtPayload } from 'jwt-decode';

// Si tu token incluye más campos personalizados, extiende JwtPayload:
export interface MyJwtPayload extends JwtPayload {
  email: string;
  nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
  // Agrega más campos si el token los incluye
}
