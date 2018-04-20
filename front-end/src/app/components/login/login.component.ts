import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	model: any = {};
	loading: boolean = false;
	private window: any;
  
  constructor(private authService: AuthService) {
  	this.window = window;
  }

  ngOnInit() {
  	
  }

  login() {
  	this.loading = true;
  	localStorage.setItem('email', this.model.email);
  	this.authService.getSpotifyAuthUrl()
  		.then(authUrl => {
        this.window.location.href = authUrl;
  		})
  }

}
