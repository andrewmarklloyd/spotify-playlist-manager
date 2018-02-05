import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	model: any = {};
  loading: any;

  constructor(private router: Router,
  					  private authService: AuthService) {
  	//https://github.com/cornflourblue/angular2-registration-login-example-cli/blob/master/src/app/register/register.component.ts

  }

  ngOnInit() {

  }

  register() {
	  this.loading = true;
	  
	}
}
