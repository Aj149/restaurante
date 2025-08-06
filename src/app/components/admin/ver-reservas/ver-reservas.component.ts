import { Component } from '@angular/core';
import { reserva } from '../../../models/dashboard';
import { ActivatedRoute, Router } from '@angular/router';
import { FormularioService } from '../../../services/formulario.service';

@Component({
  selector: 'app-ver-reservas',
  standalone: true,
  imports: [],
  templateUrl: './ver-reservas.component.html',
  styleUrl: './ver-reservas.component.css'
})
export class VerReservasComponent {

  reserva: reserva = {
    id_reserva: 0,
    nombre: '',
    email: '',
    telefono: 0,
    lugar_id: 0,
    n_personas: 0,
    fecha: '',
    horario_id: 0,
    detalles: ''
  }

  constructor(
    private formularioService: FormularioService,
    private router: ActivatedRoute,
    private route: Router,
  ) {}

  ngOnInit(): void {
    const id_reserva = this.router.snapshot.params['id_reserva'];
    this.formularioService.idReserva(id_reserva).subscribe({
      next: (data: reserva) => {
        this.reserva = data; // Aquí sin corchetes
      },
      error: (err: Error) => {
        console.error(err);
      }
    });
  }

  volver() {
  this.route.navigate(['/admin/lista-de-reservas']);
}

}
