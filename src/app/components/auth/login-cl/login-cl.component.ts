import { Component } from '@angular/core';
import { NavbarComponent } from "../../dashboard/navbar/navbar.component";
import { FooterComponent } from "../../dashboard/footer/footer.component";
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginClService } from '../../../services/login-cl.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login-cl',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, NgClass, ReactiveFormsModule],
  templateUrl: './login-cl.component.html',
  styleUrl: './login-cl.component.css'
})
export class LoginClComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  showPassword = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}


  constructor(private fb: FormBuilder, private loginClService: LoginClService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]]
    });
  }

  get email() {return this.loginForm.get('email');}
  get password() {return this.loginForm.get('password');}

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.loginClService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          // redirección
        },
        error: (error) => {
          this.isLoading = false;
          // manejo de errores
        }
      });
    }
  }
}