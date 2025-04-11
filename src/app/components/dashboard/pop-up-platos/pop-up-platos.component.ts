import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, Output, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Platos } from '../../../models/dashboard';

@Component({
  selector: 'app-pop-up-platos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pop-up-platos.component.html',
  styleUrl: './pop-up-platos.component.css'
})
export class PopUpPlatosComponent {

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el popup
  @Input() plato!: Platos;

  count: number = 0;
  total: number = 0;

  ngOnInit() {
    console.log('Plato recibido:', this.plato);
  }
  

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

}
