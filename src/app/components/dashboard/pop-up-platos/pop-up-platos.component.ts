import { Component, EventEmitter, HostListener, Inject, Input, Output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Platos } from '../../../models/dashboard';

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

  count: number = 0;
  total: number = 0;
  constructor(private router: Router) {}



  // 1cerrar el popup con ESC
  closePopup() {
    this.close.emit();
  }
  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: KeyboardEvent) {
    this.closePopup();
  }
  


// 2sumar, restar y calcular los platos que quieres
  increment() {
    if (this.count < 10) {
      this.count++;
      this.calcularTotal();
    }
  }

  decrement() {
    if (this.count > 0) {
      this.count--;
      this.calcularTotal();
    }
  }

  calcularTotal() {
    this.total = this.count * this.plato.precio;
  }

  // 5pedir platos para que vayan al carrito

  pedir() {
    const platoSeleccionado = {
      id: this.plato.id_plato,
      nombre: this.plato.nombre,
      descripcion: this.plato.descripcion,
      precio: this.plato.precio,
      imagen: this.plato.imagen,
      cantidad: this.count,
      total: this.total
    };
  
    // Puedes usar localStorage o sessionStorage según prefieras
    localStorage.setItem('platoSeleccionado', JSON.stringify(platoSeleccionado));
  
    // Redirige al login
    this.router.navigate(['/login']);
  }
  

}