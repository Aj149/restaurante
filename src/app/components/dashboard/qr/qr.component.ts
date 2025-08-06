import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css'
})
export class QrComponent {

   datos: any = null;
  error = '';
  today: Date = new Date();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const d = params.get('d');
      if (!d) {
        this.error = 'No hay datos del ticket';
        return;
      }
      try {
        const json = decodeURIComponent(atob(d));
        this.datos = JSON.parse(json);
      } catch (e) {
        this.error = 'Datos inválidos';
        console.error(e);
      }
    });
  }

  imprimir() {
    window.print();
  }

  // opcional: una función que devuelve la fecha formateada
  getFecha(): string {
    // si datos.fecha existe y es válida, la usamos; si no, usamos today
    const fecha = this.datos?.fecha ? new Date(this.datos.fecha) : this.today;
    return fecha.toLocaleString(); // te devuelve algo legible según la localización del navegador
  }
}
