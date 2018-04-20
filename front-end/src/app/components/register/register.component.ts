import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	model: any = {};
	loading: boolean = false;
	private window: any;

  constructor(private authService: AuthService) {
  	this.window = window;
  }

  ngOnInit() {
  }

  register() {
  	this.loading = true;
  	localStorage.setItem('email', this.model.email);
  	this.authService.getSpotifyAuthUrl()
  		.then(authUrl => {
        this.window.location.href = authUrl;
  		})
  }

}
