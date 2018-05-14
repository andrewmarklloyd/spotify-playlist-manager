import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

	private window: any;

  constructor(private authService: AuthService,
              private storageService: StorageService,
              private router: Router,
              private route: ActivatedRoute) {
    this.window = window;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.code) {
        this.registerOrLogin(params.code, params.state)
        .then(res => {
          this.storageService.setItem('token', res['token']);
          this.router.navigate(['/'], {queryParams: {}});
          this.window.location.href = '/';
        })
        .catch(err => {
          console.log(err)
        })
      } else {
        this.router.navigate(['/'], {queryParams: {}});
      }
    })
  }

  registerOrLogin(code, state) {
    if (state == 'register') {
      return this.authService.register(code, this.storageService.getItem('email'))
    } else if (state == 'login') {
      return this.authService.login(code, this.storageService.getItem('email'))
    } else {
      throw new Error('Wrong state');
    }
  }

  createPlaylist() {
  	return this.authService.createPlaylist();
  }
}
