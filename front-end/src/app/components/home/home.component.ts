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
  private authenticated: boolean;
  private initialized: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
    this.window = window;
    var self = this;
    this.authService.isAuthenticated()
      .then(result => {
        self.authenticated = result['authenticated'];
        self.initialized = true;
      })
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.authService.submitAccessCode(params.code)
        .then(res => {
          if (res['userId']) {
            this.authenticated = true;
            this.authService.setSession(res['userId']);
            console.log(res['playlistId'])
            //if playlist not created, then create it
            //this.authService.createPlaylist();
            this.router.navigate(['/'], {queryParams: {}});
          }
        })
        .catch(err => {
          console.log(err);
        })
      }
    })
  }

  getSpotifyAuthUrl() {
  	this.authService.getSpotifyAuthUrl()
  		.then(authUrl => {
        this.window.location.href = authUrl;
  		})
  }

  logout() {
    this.authService.logout();
    this.authenticated = false;
  }

}
