import { Component } from '@angular/core';
import { NavbarComponent } from "../../dashboard/navbar/navbar.component";
import { FooterComponent } from "../../dashboard/footer/footer.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-cl',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './login-cl.component.html',
  styleUrl: './login-cl.component.css'
})
export class LoginClComponent {

}
