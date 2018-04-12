import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  constructor(private http: Http,
  						public router: Router) {
  }

  getSpotifyAuthUrl() {
		return new Promise((resolve, reject) => {
			this.http.get(`${environment.apiDomain}api/user/auth-url`)
				.toPromise()
				.then(res => {
					resolve(res.json().authUrl)
				})
        .catch(err => {
          alert(err)
        })
		})
  }

  getUserInfo() {
    return new Promise((resolve, reject) => {
      
    })
  }

  submitAccessCode(spotifyAccessCode) {
		return new Promise((resolve, reject) => {
			this.http.post(`${environment.apiDomain}api/user/code`, {spotifyAccessCode})
				.toPromise()
				.then(res => {
					resolve(res.json())
				}).catch(err => {
          reject(err)
        })
		})
  }

  login(): void {
  	
  }

  public handleAuthentication(): void {
    
  }

  private setSession(authResult): void {  
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  private getSession(): void {
    const userSession = {
      access_token: localStorage.getItem('access_token'),
      id_token: localStorage.getItem('id_token')
    };
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('userId');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const authenticated = new Date().getTime() < expiresAt;
    return authenticated;
  }
}








