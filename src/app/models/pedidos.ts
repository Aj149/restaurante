import { Platos } from "./dashboard";
import { Usuarios } from "./registroUsuario";

export class Pedido {
    id_pedido?: number = 0;
    nombre: string = ''; 
    fecha: Date = new Date();
    estado: string = '';
    cantidad: number = 0;
    precio: number = 0;
    imagen: string = '';
    total: number = 0;
    id: number = 0;
  }

  export class DetalleFactura {
  platoId: number = 0;
  cantidad: number = 0;
  precio_unitario: number = 0;
  subtotal: number = 0;

  constructor(init?: Partial<DetalleFactura>) {
    Object.assign(this, init);
    this.subtotal = this.cantidad * this.precio_unitario;
  }
}

export class Factura {
  fecha: Date = new Date();
  usuarioId: number = 0;
  total: number = 0;
  iva: number = 0;
  total_final: number = 0;
  detalles: DetalleFactura[] = [];

  constructor(init?: Partial<Factura>) {
    Object.assign(this, init);
    this.total_final = this.total + this.iva;
  }
}
