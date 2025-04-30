import { Component } from '@angular/core';
import { NavbarComponent } from "../../dashboard/navbar/navbar.component";
import { FooterComponent } from "../../dashboard/footer/footer.component";
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, NgClass, ReactiveFormsModule, JwtModule,],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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

  get email() {
    return this.loginForm.get('email');
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

    const { email, password } = this.loginForm.value;

    this.authService.login({email, password}).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/carrito']);
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        // Aquí podrías usar Toastr para notificar al usuario
        this.isLoading = false;
      },
    });
  }
  
  
  
}