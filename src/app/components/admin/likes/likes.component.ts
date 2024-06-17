import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminComponent } from '../admin.component';
import { LikesService } from '../../../services/likes.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [RouterOutlet, AdminComponent],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.css'
})
export class LikesComponent implements OnDestroy{
  clickCount: number = 0;
  private subscription: Subscription;

  constructor(private likeService: LikesService) {
    this.subscription = this.likeService.clickCount$.subscribe(count => {
      this.clickCount = count;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
