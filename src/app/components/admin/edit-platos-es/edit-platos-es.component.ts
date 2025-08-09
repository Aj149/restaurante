import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { Platos } from '../../../models/dashboard';
import { PlatosService } from '../../../services/platos.service';
import { FormularioService } from '../../../services/formulario.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-platos-es',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-platos-es.component.html',
  styleUrl: './edit-platos-es.component.css'
})
export class EditPlatosEsComponent {
  plato: Platos = {
    id_plato: 0,
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: 0,
    cantidad: 0
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private platosService: PlatosService,
  ) {}

  ngOnInit(): void {
    const id_plato = this.activatedRoute.snapshot.params['id_plato'];
    this.platosService.id_Plato(id_plato).subscribe(
      data => {
        this.plato = data;
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
      text: "¿Deseas editar este plato?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const id_plato = this.activatedRoute.snapshot.params['id_plato'];
  
        // Convertir el precio a número
        if (this.plato.precio) {
          this.plato.precio = Number(this.plato.precio);
        }
        this.platosService.update(id_plato, this.plato).subscribe(
          (data: any) => {
            this.toastr.success(data.message, 'Plato editado correctamente', {
              timeOut: 7000, positionClass: 'toast-top-center'
            });
            this.volver();
          },
          (err: any) => {
            console.log("Error:", err);
            this.toastr.error(err.error.message, 'El error es:', {
              timeOut: 7000, positionClass: 'toast-top-center',
            });
          }
        );
      }
    });
  }
  
  
    volver(): void {
      this.router.navigate(['/admin/lista-de-platos']);
    }
}
