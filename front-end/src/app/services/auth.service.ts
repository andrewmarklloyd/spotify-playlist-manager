import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

	auth0 = new auth0.WebAuth({
    clientID: '20q4K0qOtDnSdZImAk8mdJgVz64nSDvr',
    domain: 'spotify-playlists.auth0.com',
    responseType: 'token id_token',
    audience: 'https://spotify-playlists.auth0.com/userinfo',
    redirectUri: 'http://localhost:4200/callback/',
    scope: 'openid'
  });

  constructor(private http: Http,
  						public router: Router) {

  }

  getAuthUrl() {
		return new Promise((resolve, reject) => {
			this.http.get(`${environment.apiDomain}api/user/auth-url`)
				.toPromise()
				.then(res => {
					resolve(res.json().authUrl)
				})
		})
  }

  submitAccessCode(accessCode) {
		return new Promise((resolve, reject) => {
			this.http.post(`${environment.apiDomain}api/user/code`, {accessCode: accessCode})
				.toPromise()
				.then(res => {
					resolve(res.json())
				})
		})
  }

  login(): void {
  	this.auth0.authorize();
  }

  public handleAuthentication(): void {
  	console.log('handle authentication')
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const authenticated = new Date().getTime() < expiresAt;
    console.log('user authenticated:', authenticated)
    return authenticated;
  }
}








