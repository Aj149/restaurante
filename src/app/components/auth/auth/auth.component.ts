import { Component } from '@angular/core';
import { NavbarComponent } from "../../dashboard/navbar/navbar.component";
import { FooterComponent } from "../../dashboard/footer/footer.component";
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, NgClass, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  showPassword = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}


  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private jwtHelper: JwtHelperService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    const credentials = this.loginForm.value;

    this.auth.login(credentials).subscribe({
      next: (response) => {
        // Asumimos que el token viene como `response.token`
        localStorage.setItem('token', response.token);

        // Opcional: Decodificar y obtener info del usuario
        const decodedToken = this.jwtHelper.decodeToken(response.token);
        console.log('Usuario autenticado:', decodedToken);

        this.toastr.success('¡Inicio de sesión exitoso!');
        this.router.navigate(['/dashboard']); // Cambia por tu ruta principal
      },
      error: (err) => {
        this.toastr.error('Correo o contraseña incorrectos');
        console.error(err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  
}