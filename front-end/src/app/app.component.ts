import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	isLoggedIn: boolean;
	window: any;

  constructor(private authService: AuthService) {
    this.isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
    this.window = window;
  }

  logout() {
  	this.authService.logout();
  	this.window.location.href = '/';
  }
}
