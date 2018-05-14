import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	model: any = {};
	loading: boolean = false;
	private window: any;
  
  constructor(private authService: AuthService,
              private storageService: StorageService) {
  	this.window = window;
  }

  ngOnInit() {
  	
  }

  login() {
  	this.loading = true;
  	this.storageService.setItem('email', this.model.email);
  	this.authService.getSpotifyAuthUrl('login')
  		.then(authUrl => {
        this.window.location.href = authUrl;
  		})
  }

}
