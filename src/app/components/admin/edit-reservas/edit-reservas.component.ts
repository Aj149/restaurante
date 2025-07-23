import { Component } from '@angular/core';

import { FormularioService } from '../../../services/formulario.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { reserva } from '../../../models/dashboard';

@Component({
  selector: 'app-edit-reservas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-reservas.component.html',
  styleUrl: './edit-reservas.component.css'
})
export class EditReservasComponent {

  reservas: reserva ={
    nombre: '',
    email: '',
    telefono: 0,
    lugar: '',
    n_personas: 0,
    fecha: '',
    hora: '',
    detalles: ''
  }

  constructor(
    private formularioService: FormularioService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) { }


  ngOnInit(): void {
    const id_reserva = this.activatedRoute.snapshot.params['id_reserva'];
    this.formularioService.idReserva(id_reserva).subscribe(
      data => {
        this.reservas = data;
      },
      err => {
        this.toastr.error(err.error.message, 'Fail', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
        this.router.navigate(['/']);
      }
    );
  }



  Update(): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas editar esta reserva?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const id_reserva = this.activatedRoute.snapshot.params['id_reserva'];
        this.formularioService.update(id_reserva, this.reservas).subscribe(
          (data: any) => {
            this.toastr.success(data.message, 'Reserva editada correctamente', {
              timeOut: 7000, positionClass: 'toast-top-center'
            });
            this.volver();
          },
          (err: any) => {
            this.toastr.error(err.error.message, 'El error es:', {
              timeOut: 7000, positionClass: 'toast-top-center',
            });
          }
        );
      }
    });
  }




  volver(): void {
    this.router.navigate(['/admin/lista-de-reservas']);
  }
}
