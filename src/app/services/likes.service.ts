import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LikesService {
 
  private clickCountSubject = new BehaviorSubject<number>(0);
  clickCount$ = this.clickCountSubject.asObservable();

  constructor() { }

  incrementClickCount() {
    const currentCount = this.clickCountSubject.value;
    this.clickCountSubject.next(currentCount + 1);
  }
}
