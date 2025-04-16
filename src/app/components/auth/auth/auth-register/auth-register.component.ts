import { Component } from '@angular/core';
import { FooterComponent } from "../../../dashboard/footer/footer.component";
import { NavbarComponent } from "../../../dashboard/navbar/navbar.component";

@Component({
  selector: 'app-auth-register',
  standalone: true,
  imports: [FooterComponent, NavbarComponent],
  templateUrl: './auth-register.component.html',
  styleUrl: './auth-register.component.css'
})
export class AuthRegisterComponent {

}
