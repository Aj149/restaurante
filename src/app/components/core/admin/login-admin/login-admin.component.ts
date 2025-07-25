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
  
    get cedula() {
      return this.loginForm.get('cedula');
    }
    
  
    get password() {
      return this.loginForm.get('password');
    }
  
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
    
  
  
    onSubmit() {
      if (this.loginForm.invalid) return;
      this.isLoading = true;
    
      const { cedula, password } = this.loginForm.value;
    
      this.adminService.login({ cedula, password }).subscribe({
        next: (response) => {
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          this.isLoading = false;
    
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
