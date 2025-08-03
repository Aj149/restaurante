import { Component } from '@angular/core';


@Component({
  selector: 'app-qr',
  standalone: true,
  imports: [],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css'
})
export class QrComponent {

  mostrarQR = false;
  infoReserva = '';
  qrData = '';

   generarQR() {
    const datos = {
      totalParcial: this.subtotal.toFixed(2),
      iva: this.costoEnvio.toFixed(2),
      totalFinal: this.totalFinal.toFixed(2),
      platos: this.platosSeleccionados, // ejemplo
      lugar: this.lugarSeleccionado, // ejemplo
      mesas: this.mesas,
      sillas: this.sillas,
    };

    this.qrData = JSON.stringify(datos, null, 2);
    this.mostrarQR = true;
  }

  descargarQR() {
    const qrElement: any = document.getElementById('codigoQR');
    const img = qrElement.querySelector('img');

    if (img) {
      const url = img.src;
      const a = document.createElement('a');
      a.href = url;
      a.download = 'codigo_qr.png';
      a.click();
    }
  }

}
