import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

	private window: any;
  private initialized: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
    this.window = window;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.authService.submitAccessCode(params.code)
        .then(res => {
          if (res['userId']) {
            this.authService.setSession(res['userId']);
            return this.getPlaylistId();
          } else {
          	return Promise.reject('There was an error');
          }
        })
        .then(data => {
        	if (data['playlistId']) {
        		console.log(data['playlistId'])
        		//this.router.navigate(['/'], {queryParams: {}});
        	} else {
        		return this.createPlaylist();
        	}
        })
        .then(result => {
        	const playlistUrl = `https://open.spotify.com/user/andrewlloyd85/playlist/7cseUSF9JjRQVNYTuKC1Df?si=cvQhowHoRP6RTYs5OIPZiQ`;
        	console.log(result);
        })
        .catch(err => {
          console.log(err);
        })
      }
    })
  }

  getPlaylistId() {
  	return this.authService.getPlaylistId();
  }

  createPlaylist() {
  	return this.authService.createPlaylist();
  }

  getSpotifyAuthUrl() {
  	this.authService.getSpotifyAuthUrl()
  		.then(authUrl => {
        this.window.location.href = authUrl;
  		})
  }

  logout() {
    this.authService.logout();
  }

}
