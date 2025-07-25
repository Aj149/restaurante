import { Component } from '@angular/core';
import { Bebidas } from '../../../models/dashboard';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BebidasService } from '../../../services/bebidas.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-bebida',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './edit-bebida.component.html',
  styleUrl: './edit-bebida.component.css'
})
export class EditBebidaComponent {


  bebida : Bebidas = {
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: 0
  }

  constructor(
    private Router : Router,
    private  ActivatedRoute : ActivatedRoute,
    private toastr: ToastrService,
    private bebidasService: BebidasService,
  ) {}


  ngOnInit(): void {
    const id_bebida = this.ActivatedRoute.snapshot.params['id_bebida'];
    this.bebidasService.id_bebida(id_bebida).subscribe(
      data => {
        this.bebida = data;
      },
      err => {
        this.toastr.error(err.error.message, 'Fail', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
        this.Router.navigate(['/']);
      }
    );
  }

  guardar(): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Deseas editar esta bebida?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const id_bebida = this.ActivatedRoute.snapshot.params['id_bebida'];

        if (this.bebida.precio) {
          this.bebida.precio = Number(this.bebida.precio);
        }

        this.bebidasService.update(id_bebida, this.bebida).subscribe(
          data => {
            this.toastr.success('Bebida editada correctamente', 'OK', {
              timeOut: 3000,
              positionClass: 'toast-top-center',
            });
            this.Router.navigate(['/admin/bebidas']);
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
}
