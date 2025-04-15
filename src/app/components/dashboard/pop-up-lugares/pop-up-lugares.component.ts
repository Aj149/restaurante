import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Lugares } from '../../../models/dashboard';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pop-up-lugares',
  standalone: true,
  imports: [CarouselModule, RouterLink],
  templateUrl: './pop-up-lugares.component.html',
  styleUrl: './pop-up-lugares.component.css'
})
export class PopUpLugaresComponent {

  @Input() isVisible: boolean = false;
    @Output() close = new EventEmitter<void>(); // Evento para cerrar el popup
    @Input() lugar!: Lugares;

    count: number = 0;
    total: number = 0;


    ngOnInit() {
      console.log('lugar recibido:', this.lugar);
    }

    closePopup() {
        this.close.emit();
      }
      @HostListener('document:keydown.escape', ['$event'])
      onEscKey(event: KeyboardEvent) {
        this.closePopup();
      }

      // 2sumar, restar y calcular los lugares que quieres
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
    this.total = this.count * this.lugar.precio;
  }

  customOptions1: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 500, // ⏩ Velocidad entre imágenes
    autoplayHoverPause: true,
    smartSpeed: 300, // ⏱️ Velocidad de la transición (en ms)
    items: 1,
    animateOut: 'fadeOut'
  };
  

}
