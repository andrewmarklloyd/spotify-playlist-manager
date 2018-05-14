import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	model: any = {};
	loading: boolean = false;
	private window: any;

  constructor(private authService: AuthService,
              private storageService: StorageService) {
  	this.window = window;
  }

  ngOnInit() {
  }

  register() {
  	this.loading = true;
  	this.storageService.setItem('email', this.model.email);
  	this.authService.getSpotifyAuthUrl('register')
  		.then(authUrl => {
        this.window.location.href = authUrl;
  		})
  }

}
