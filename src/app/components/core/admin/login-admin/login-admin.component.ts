import { Component } from '@angular/core';
import { FooterComponent } from "../../../dashboard/footer/footer.component";
import { NavbarComponent } from "../../../dashboard/navbar/navbar.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';
import { AdminService } from '../../../../services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, RouterLink, NgClass, ReactiveFormsModule, JwtModule, RouterOutlet],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {

  loginForm: FormGroup;
    isLoading = false;
    showPassword = false;
  
    constructor(
      private fb: FormBuilder,
      private adminService: AdminService,
      private router: Router
    ) {
      this.loginForm = this.fb.group({
        cedula: ['', [Validators.required, Validators.minLength(10),Validators.pattern(/^[0-9]+$/)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
          ],
        ],
      });
      
    }
  // Getter para obtener el control del formulario llamado 'cedula'
get cedula() {
  return this.loginForm.get('cedula');  // Retorna el control del formulario para la cédula
}

// Getter para obtener el control del formulario llamado 'password'
get password() {
  return this.loginForm.get('password');  // Retorna el control del formulario para la contraseña
}

// Función que alterna la visibilidad de la contraseña
togglePasswordVisibility() {
  this.showPassword = !this.showPassword;  // Cambia el valor booleano para mostrar u ocultar la contraseña
}

// Función que se ejecuta cuando se envía el formulario (login)
onSubmit() {
  // Si el formulario es inválido, no hacer nada (evitar enviar datos erróneos)
  if (this.loginForm.invalid) return;

  this.isLoading = true;  // Indica que se está procesando el inicio de sesión (puede mostrar un spinner)

  // Extrae los valores 'cedula' y 'password' del formulario
  const { cedula, password } = this.loginForm.value;

  // Llama al servicio para iniciar sesión enviando las credenciales
  this.adminService.login({ cedula, password }).subscribe({
    // Si la respuesta es exitosa
    next: (response) => {
      this.router.navigate(['/admin']);  // Redirige a la página de administración
    },

    // Si ocurre un error al iniciar sesión
    error: (err) => {
      console.error('Error al iniciar sesión:', err);  // Muestra el error en consola
      this.isLoading = false;  // Detiene el indicador de carga

      // Muestra una alerta amigable con SweetAlert para informar del error
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Credenciales inválidas o error de red. Intente nuevamente.',
        confirmButtonColor: '#d33',
      });
    }
  });
}
 }