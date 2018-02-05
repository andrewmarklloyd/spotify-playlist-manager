import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	model: any = {};
  loading: any;
  returnUrl: string;

  constructor(private authService: AuthService,
  						private router: Router,
  						private route: ActivatedRoute) {

  }

  ngOnInit() {
    // reset login status
    //this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  login() {
	  this.loading = true;
    console.log('logging in')
	  this.authService.login();
	}

}
