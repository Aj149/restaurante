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
      telefono: ['', [Validators.required, Validators.pattern(/^09[0-9]{8}$/)]],
      email: ['', [ Validators.required, Validators.email, Validators.maxLength(100) ]],
      password: ['', [ Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-]).{8,}$/) ]],
      website: ['']
    });
  }// Getter para acceder fácilmente a los controles del formulario de registro
get f() { 
  return this.registerForm.controls;  // Retorna todos los controles del formulario 'registerForm'
}

// Función que se ejecuta cuando el usuario envía el formulario de registro
onSubmit() {
  // Validación simple para detectar bots: si el campo 'website' tiene valor, se detiene el envío
  if (this.registerForm.get('website')?.value) {
    console.warn('Bot detectado: no enviar datos');
    return;  // No enviar datos si se detecta bot
  }

  // Si el formulario es inválido, no continuar
  if (this.registerForm.invalid) return;

  this.isLoading = true;  // Muestra indicador de carga (por ejemplo, un spinner)
  this.errorMessage = ''; // Limpia mensajes de error previos

  // Llama al servicio de autenticación para registrar al usuario con los datos del formulario
  this.authService.register(this.registerForm.value).subscribe({
    // Si el registro fue exitoso
    next: (response) => {
      this.isLoading = false;  // Quita indicador de carga

      // Muestra alerta de éxito con SweetAlert
      Swal.fire({
        icon: 'success',
        title: '¡Usuario creado!',
        text: 'Tu cuenta ha sido creada exitosamente.',
        showConfirmButton: false,
        timer: 2500  // La alerta se cierra automáticamente después de 2.5 segundos
      }).then(() => {
        this.router.navigate(['/login']);  // Redirige a la página de login después de cerrar la alerta
      });
    },

    // Si ocurre un error durante el registro
    error: (err) => {
      this.isLoading = false;  // Quita indicador de carga

      // Si el error indica que el email ya está registrado
      if (err.error?.message === 'Email ya registrado') {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El email electrónico ya está registrado. Por favor, usa otro email.',
        });
      } else {
        // En caso de otros errores, muestra un mensaje genérico o el mensaje recibido
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

// Función para mostrar u ocultar la contraseña en el formulario
togglePasswordVisibility() {
  this.showPassword = !this.showPassword;  // Cambia el estado para mostrar o ocultar la contraseña
}
}