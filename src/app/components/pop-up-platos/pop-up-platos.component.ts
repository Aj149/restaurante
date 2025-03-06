import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pop-up-platos',
  standalone: true,
  imports: [],
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

}
