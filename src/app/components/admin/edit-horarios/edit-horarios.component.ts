import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Horario } from '../../../models/dashboard';

@Component({
  selector: 'app-edit-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-horarios.component.html',
  styleUrls: ['./edit-horarios.component.css']
})
export class EditHorariosComponent {

  @Input() horario: Horario | null = null;

  @Output() guardar = new EventEmitter<Horario>();
  @Output() cancelar = new EventEmitter<void>();

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  onGuardar() {
    if (this.horario) {
      this.guardar.emit(this.horario);
    }
  }

  onCancelar() {
    this.cancelar.emit();
  }
}
