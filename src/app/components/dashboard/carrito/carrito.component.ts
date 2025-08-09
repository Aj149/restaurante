import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../../../services/auth.service';
import { PlatosService } from '../../../services/platos.service';
import { Router } from '@angular/router';
import { DetalleFactura, Factura, Pedido } from '../../../models/pedidos';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuarios } from '../../../models/registroUsuario';
import Swal from 'sweetalert2';
import { Platos } from '../../../models/dashboard';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, ReactiveFormsModule, QRCodeModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  usuario: Usuarios | null = null;

  count: number = 0;
  totalFinal: number = 0;

 
  pedido: Pedido[] = []; 
  subtotal: number = 0;

  total: number = 0;



  isLoading: boolean = true;

  // 5para generar el pdf de la compra de los platos

  
  platosSeleccionados: Platos[] = [];
usuarios: Usuarios = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  telefono: '',
  direccion: '',
  platos: [] // si quieres dejar aquí, pero no es recomendable
};

iva: number = 1.50;
  generarFactura() {
    this.calcularTotal();

    this.pedido.forEach((p, i) => {
    console.log(`pedido[${i}] id:`, p.id, typeof p.id);
    console.log(`pedido[${i}] precio:`, p.precio, typeof p.precio);
  });

  console.log('pedido completo:', this.pedido);

    // Crear detalles desde pedido
    const detalles = this.pedido.map(p => new DetalleFactura({
      platoId: Number(p.id_pedido),
    cantidad: Number(p.cantidad),
    precio_unitario: Number(p.precio)
    }));

    // Crear la factura completa
    const factura = new Factura({
      fecha: new Date(),
      usuarioId: this.usuario?.id || 0,
      total: this.subtotal,
      iva: this.iva,
      detalles: detalles
    });

    // **Log para ver qué datos se enviarán al backend**
    console.log('Factura a enviar:', factura);

    // Aquí llamas al servicio para enviar 'factura' al backend
    this.platosService.crearFactura(factura).subscribe({
      next: (res) => {
        console.log('Factura guardada', res);
        const datosBase64 = btoa(encodeURIComponent(JSON.stringify(res)));
      this.router.navigate(['/ticket'], { queryParams: { d: datosBase64 } });
        // navegar a ticket, etc.
      },
      error: (err) => {
        console.error('Error guardando factura', err);
        // **Log para ver detalle del error**
        console.log('Error completo:', err);
      }
    });
  }




  cargarDatosUsuario() {
    const userData = this.authService.getUserData();
    if (userData) {
      this.usuarios = userData;
    } else {
      console.warn('No se encontró datos del usuario en localStorage');
    }
  }

calcularTotal() {
  this.total = this.pedido.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  this.subtotal = this.total;  
  this.totalFinal = this.subtotal + this.iva;
}

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private platosService: PlatosService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.checkForTemporaryOrder();
    this.loadCartItems();
    this.getUserInfo();
    this.calcularTotal(); 
    this.cargarDatosUsuario();
  }

  private checkForTemporaryOrder() {
    const pedidoTemp = localStorage.getItem('pedidoTemporal');
    if (pedidoTemp) {
      try {
        const pedido: Pedido = JSON.parse(pedidoTemp);
        this.platosService.agregar(pedido);
        localStorage.removeItem('pedidoTemporal');
      } catch (error) {
        console.error('Error al procesar pedido temporal:', error);
      }
    }
  }
  
  
  

  loadCartItems() {
    this.platosService.articulos.subscribe({
      next: (items) => {
        this.pedido = items;
        this.calcularTotal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el carrito:', err);
        this.isLoading = false;
      }
    });
  }


  getUserInfo() {
    const user = this.authService.getUserData();
    console.log('Usuario cargado:', user);
    if (user) {
      this.usuario = user;  // Asignamos el usuario (objeto)
    } else {
      console.warn('No se pudo cargar el usuario');
    }
  }
  
  
  
  

  removeItem(index: number) {
    this.platosService.removeFromCart(index);
  }

  updateQuantity(index: number, change: number) {
    this.platosService.updateQuantity(index, change);
  }
  
  
  

  logout() {
    this.authService.logout();
    this.router.navigate(['/inicio']);
  }


  agregar(item: any) {
    // Verificar si el plato ya está en el pedido
    const existingItem = this.pedido.find(p => p.id_pedido === item.id_pedido);
  
    if (existingItem) {
      // Si ya existe, solo incrementa la cantidad
      existingItem.cantidad++;
    } else {
      // Si no existe, agrega el nuevo plato con cantidad 1
      this.pedido.push({ ...item, cantidad: 1 });
    }
    this.calcularTotal();
  }
  
  increment(item: any) {
    if (item.cantidad < 10) {
      item.cantidad++;
      this.calcularTotal(); // 🔁 recalcula el total
    }
  }
  
  decrement(item: any) {
    if (item.cantidad > 0) {
      item.cantidad--;
      this.calcularTotal(); // 🔁 recalcula el total
    }
  }

  
}
