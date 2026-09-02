import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthUser } from '../../models/user.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  currentUser: AuthUser | null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }
}
