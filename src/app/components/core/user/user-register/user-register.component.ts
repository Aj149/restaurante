import { Component } from '@angular/core';
import { FooterComponent } from "../../../dashboard/footer/footer.component";
import { NavbarComponent } from "../../../dashboard/navbar/navbar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.css'
})
export class UserRegisterComponent {

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.maxLength(50)]],
      direccion: ['', [Validators.required, Validators.maxLength(100)]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      ]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    if (this.registerForm.invalid) return;
  
    console.log('Datos enviados:', this.registerForm.value);
    this.isLoading = true;
    this.errorMessage = '';
  
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
  
        // Mostrar alerta de éxito cuando el usuario se haya creado
        Swal.fire({
          icon: 'success',
          title: '¡Usuario creado!',
          text: 'Tu cuenta ha sido creada exitosamente.',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          this.router.navigate(['/login']); // Redirigir a la página de login después de la alerta
        });
      },
      error: (err) => {
        this.isLoading = false;
  
        // Mostrar alerta si el email ya existe
        if (err.error?.message === 'Email ya registrado') {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El email electrónico ya está registrado. Por favor, usa otro email.',
          });
        } else {
          // Alerta genérica de error
          this.errorMessage = err.error?.message || 'Error en el registro';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.errorMessage,
          });
        }
      }
    });
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}