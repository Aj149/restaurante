import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { AuthService } from '../../../services/auth.service';
import { PlatosService } from '../../../services/platos.service';
import { Router } from '@angular/router';
import { Pedido } from '../../../models/popup';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuarios } from '../../../models/registroUsuario';
import { Platos } from '../../../models/dashboard';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  usuario: Usuarios | null = null;

  count: number = 0;
  totalFinal: number = 0;

 
  pedido: any[] = []; 
  subtotal: number = 0;
  costoEnvio: number = 5.00;
  total: number = 0;
  paymentForm: FormGroup;


  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private platosService: PlatosService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      cardName: ['', Validators.required],
      cardNumber: ['',[Validators.required,Validators.pattern(/^(\d{4} ?){4}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]] 
    });
  }

  ngOnInit() {
    this.checkForTemporaryOrder();
    this.loadCartItems();
    this.getUserInfo();
    this.calcularTotal(); 
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
  
  formatearTarjeta() {
    const control = this.paymentForm.get('cardNumber');
    if (!control) return;
  
    let value = control.value || '';
    value = value.replace(/\D/g, ''); // Solo dígitos
  
    // Agrupa cada 4 dígitos con un espacio, máximo 16 dígitos (19 con espacios)
    if (value.length > 16) {
      value = value.slice(0, 16);
    }
  
    const formatted = value.match(/.{1,4}/g)?.join(' ') ?? '';
    control.setValue(formatted, { emitEvent: false });
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

  calcularTotal() {
    this.total = this.pedido.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    this.subtotal = this.total;  // Suponiendo que no haya descuentos
    this.totalFinal = this.subtotal + this.costoEnvio;
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

  realizarPedido() {
    if (this.paymentForm.valid) {
      // Simula pago exitoso
      Swal.fire({
        icon: 'success',
        title: '¡Pago exitoso!',
        text: 'Tu compra se ha realizado correctamente.',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        // Limpiar los campos del formulario
        this.paymentForm.reset();
  
        // Si tienes variables para los platos seleccionados o precios, puedes restablecerlos aquí
        // Ejemplo:
        this.totalFinal = 0; // Resetear el total final
        this.subtotal = 0; // Resetear el subtotal
        this.costoEnvio = 0; // Resetear el costo de envío
        this.count = 0; // Resetear el contador de platos

        this.pedido = []; // Vaciar los platos seleccionados
        this.total = 0; // Resetear el total
  
        // Si hay imágenes, ocultarlas
        // Ejemplo de ocultar imágenes, si están en el DOM:
        const imagenes = document.querySelectorAll('.imagen-plato');
        imagenes.forEach(imagen => {
          imagen.classList.add('d-none'); // Esconde las imágenes, por ejemplo con Bootstrap
        });
  
        // Redirigir al usuario a una página limpia si es necesario, por ejemplo al inicio
        // this.router.navigate(['/home']);
      });
  
      console.log(this.paymentForm.value);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Por favor, completa todos los campos correctamente.',
        confirmButtonColor: '#d33'
      });
    }
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
