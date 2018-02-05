import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private window: any;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
    this.window = window;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.authService.submitAccessCode(localStorage.getItem('userId'), params.code)
          .then(response => {
            console.log(response)
          })
      }
    })
  }

  getAuthUrl() {
  	this.authService.getAuthUrl()
  		.then(authUrl => {
        this.window.location.href = authUrl;
  		})
  }

}
