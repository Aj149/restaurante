import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AutoplayService } from 'ngx-owl-carousel-o/lib/services/autoplay.service';

@Component({
  selector: 'app-lugar1',
  standalone: true,
  imports: [RouterOutlet, RouterLink,NavbarComponent, FooterComponent, CarouselModule],
  templateUrl: './lugar1.component.html',
  styleUrl: './lugar1.component.css'
})
export class Lugar1Component {



  customOptions1: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000, // Tiempo total del carrusel
    autoplayHoverPause: true,
    items: 1,
    animateOut: 'fadeOut' // Efecto de desvanecimiento
  };
  
  
}
