import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { PersonalService } from '../../../services/personal.service';
import { Router } from '@angular/router';
import { Personal } from '../../../models/dashboard';

@Component({
  selector: 'app-pop-up-personal',
  standalone: true,
  imports: [],
  templateUrl: './pop-up-personal.component.html',
  styleUrl: './pop-up-personal.component.css'
})
export class PopUpPersonalComponent {

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() personal!: Personal;


  constructor(
    private router: Router,
    private personalService: PersonalService,
  ) {}


  // 1cerrar el pop up
  closePopup() {
    this.close.emit();
  }
  @HostListener('document:keydown.escape', ['$event'])
    onEscKey(event: KeyboardEvent) {
      this.closePopup();
    }
}
