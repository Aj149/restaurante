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
    detalles: string='';
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
    dia : string='';
    hora: string='';
    estado: string='';
}

export class Horario {
  id: number = 0;
  id_lugar?: number=0;
  dia: string = '';
  horaInicio: string = '';
  horaFin: string = '';
  estado: string = '';
}

export class Personal {
  id_persona?: number = 0;
  nombre: string = '';
  email: string = '';
  telefono: string = '';
  direccion: string = '';
  cedula: number = 0; 
  nacionalidad: string = '';
  imagen: string = '';
  puesto: string = '';
  fecha_contratacion: string = '';
  fecha_nacimiento: string = '';
  salario: number = 0;
  genero: string = '';
  jornadaLaboral: string = '';
  descripcion: string = '';
}

export class Bebidas {
  id_bebida?: number = 0;
  nombre: string = '';
  descripcion: string = '';
  imagen: string = '';
  precio: number = 0;
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
