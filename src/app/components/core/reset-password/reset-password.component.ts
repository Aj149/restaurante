import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from "../../dashboard/footer/footer.component";
import { NavbarComponent } from "../../dashboard/navbar/navbar.component";
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NavbarComponent, FooterComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  token: string | null = null;
  showPassword: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-]).{8,}$/)
      ]]
    });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    const newPassword = this.resetForm.value.newPassword;

    this.http.post('http://localhost:8000/usuarios/reset-password', {
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
          this.router.navigate(['/login']);
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
