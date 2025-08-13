import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NavbarComponent } from "../../../dashboard/navbar/navbar.component";
import { FooterComponent } from "../../../dashboard/footer/footer.component";

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NavbarComponent, FooterComponent],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css'
})
export class ResetComponent {

  resetForm!: FormGroup;
  token: string | null = null;
  showPassword: boolean = false;

  constructor (
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      newPassword: ['',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-]).{8,}$/)]]
    });
// 1 Se suscribe a los parámetros de la URL para obtener valores que vienen en la consulta (?token=...)
    this.route.queryParams.subscribe(params => {
      this.token = params['token']; //1 Guarda el valor del parámetro 'token' en la variable 'token'
    });
  }
// 1 Getter para obtener el control del formulario llamado 'newPassword'
  get newPassword() {
    return this.resetForm.get('newPassword'); // 1 Retorna el control del formulario para la nueva contraseña
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    const newPassword = this.resetForm.value.newPassword;

    this.http.post('http://localhost:8000/admin/reset-password', {

      token: this.token,
      newPassword
    }).subscribe({
      next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Contraseña actualizada!',
            text: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
            confirmButtonText: 'Ir al login'
          }).then(() => {
            this.router.navigate(['/loginAdmin']);
          });
        },
        error: err => {
          console.error('Error al actualizar contraseña', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la contraseña. Inténtalo de nuevo.',
            confirmButtonText: 'Aceptar'
          });
      }
    });
    }
  }
