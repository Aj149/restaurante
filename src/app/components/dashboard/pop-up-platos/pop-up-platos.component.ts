import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pop-up-platos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pop-up-platos.component.html',
  styleUrl: './pop-up-platos.component.css'
})
export class PopUpPlatosComponent {

  @Input() titulo: string='hola';
  @Input() descripcion: string='';
  @Input() imagen: string="";
  @Input() precio: number= 0;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el popup


  closePopup() {
    this.close.emit();
  }



  @HostListener('document:keydown.escape', ['$event'])
  onEscKey(event: KeyboardEvent) {
    this.closePopup();
  }

  count: number = 0;

increment() {
  if (this.count < 10) {
    this.count++;
  }
}

decrement() {
  if (this.count > 0) {
    this.count--;
  }
}


}
