import { Component, EventEmitter, HostListener, Inject, Input, Output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Platos } from '../../../models/dashboard';
import { PlatosService } from '../../../services/platos.service';
import { AuthService } from '../../../services/auth.service';
import { Pedido } from '../../../models/popup';

@Component({
  selector: 'app-pop-up-platos',
  standalone: true,
  imports: [],
  templateUrl: './pop-up-platos.component.html',
  styleUrl: './pop-up-platos.component.css'
})
export class PopUpPlatosComponent {

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el popup
  @Input() plato!: Platos;

 
  constructor(
    private router: Router,
    private platosService: PlatosService,
    private authService: AuthService
  ) {}



  // 1cerrar el popup con ESC
  closePopup() {
    this.close.emit();
  }
  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: KeyboardEvent) {
    this.closePopup();
  }
  


  // 5pedir platos para que vayan al carrito

  pedir() {
    if (this.plato) {
      const pedido: Pedido = {
        id_pedido: this.plato.id_plato,
        nombre: this.plato.nombre,
        precio: this.plato.precio,
        imagen: this.plato.imagen,
        cantidad: 0,
        total: 0
      };
  
      // Guardar el pedido temporalmente en localStorage
      localStorage.setItem('pedidoTemporal', JSON.stringify(pedido));
      console.log('Pedido guardado:', pedido);
  
      this.authService.isAuthenticated().subscribe({
        next: (isAuthenticated) => {
          if (!isAuthenticated) {
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: '/carrito' }
            });
          } else {
            this.procesarPedido(pedido);
          }
        },
        error: (err) => {
          console.error('Error en autenticación:', err);
          alert('Hubo un error al verificar la autenticación.');
        }
      });
    } else {
      alert("Debes seleccionar al menos un plato.");
    }
  }
  
  
  private procesarPedido(pedido: Pedido) {
    try {
      this.platosService.agregar(pedido);
      localStorage.removeItem('pedidoTemporal'); // Limpiar después de usar
      this.router.navigate(['/carrito']);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Hubo un error al agregar el pedido al carrito. Inténtalo de nuevo.');
    }
  }
}