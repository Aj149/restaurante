import { Component } from '@angular/core';
import { Lugares } from '../../../models/dashboard';
import { ActivatedRoute, Router } from '@angular/router';
import { LugaresService } from '../../../services/lugares.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-lugar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-lugar.component.html',
  styleUrl: './edit-lugar.component.css'
})
export class EditLugarComponent {

  lugar: Lugares = {
    id_lugar: 0,
    descripcion: '',
    nombre: '',
    imagen: '',
    precio: 0,
    capacidad: 0
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private lugaresService: LugaresService,
  ) {}

  ngOnInit(): void {
    const id_lugar = this.activatedRoute.snapshot.params['id_lugar'];
    this.lugaresService.id_lugar(id_lugar).subscribe(
      data => {
        this.lugar = data;
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

  guardarCambios(): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas editar este lugar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const id_lugar = this.activatedRoute.snapshot.params['id_lugar'];

        if (this.lugar.precio) {
          this.lugar.precio = Number(this.lugar.precio);
        }

        this.lugaresService.update(id_lugar, this.lugar).subscribe(
          data => {
            this.toastr.success('Lugar editado correctamente', 'Éxito', {
              timeOut: 3000,
              positionClass: 'toast-top-center',
            });
            this.router.navigate(['/admin/lugares']);
          },
          err => {
            this.toastr.error(err.error.message, 'Fail', {
              timeOut: 3000,
              positionClass: 'toast-top-center',
            });
          }
        );
      }
    });
  }
  volver(): void {
    this.router.navigate(['/admin/lugares']);
  }

}
