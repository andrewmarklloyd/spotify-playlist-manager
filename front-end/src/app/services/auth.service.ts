import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  constructor(private http: Http,
  						public router: Router) {
  }

  public getSpotifyAuthUrl(authType) {
		return new Promise((resolve, reject) => {
      const options = new RequestOptions({ params: { authType } })
			this.http.get(`${environment.apiDomain}api/user/auth-url`, options)
				.toPromise()
				.then(res => {
					resolve(res.json().authUrl)
				})
        .catch(err => {
          alert(err)
        })
		})
  }

  public register(spotifyAuthCode, email) {
		return new Promise((resolve, reject) => {
			this.http.post(`${environment.apiDomain}api/auth/register`, {spotifyAuthCode, email})
				.toPromise()
				.then(res => {
					resolve(res.json())
				}).catch(err => {
          reject(err)
        })
		})
  }

  public login(spotifyAuthCode, email) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiDomain}api/auth/login`, {spotifyAuthCode, email})
        .toPromise()
        .then(res => {
          resolve(res.json())
        }).catch(err => {
          reject(err)
        })
    })
  }

  public setSession(userId): void {  
    localStorage.setItem('userId', userId);
  }

  private getSession(): void {
    const userSession = {
      access_token: localStorage.getItem('access_token'),
      id_token: localStorage.getItem('id_token')
    };
  }

  public logout(): void {
    localStorage.removeItem('userId');
    this.router.navigate(['/']);
    this.router.navigate(['/'], {queryParams: {}});
  }

  public isAuthenticated() {
    return new Promise((resolve, reject) => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.http.post(`${environment.apiDomain}api/user/authenticate`, { userId })
          .toPromise()
          .then(response => {
            resolve(response.json());
          }).catch(err => {
            reject(err);
          })
      } else {
        resolve(false);
      }
    });
  }

  public createPlaylist() {
    return new Promise((resolve, reject) => {
      const userId = localStorage.getItem('userId');
      this.http.post(`${environment.apiDomain}api/user/create-playlist`, { userId })
        .toPromise()
        .then(response => {
          resolve(response.json());
        }).catch(err => {
          reject(err);
        })
    });
  }

  public getPlaylistId() {
    return new Promise((resolve, reject) => {
      const userId = localStorage.getItem('userId');
      const options = new RequestOptions({ params: { userId } })
      this.http.get(`${environment.apiDomain}api/user/playlist-id`, options)
        .toPromise()
        .then(response => {
          resolve(response.json());
        }).catch(err => {
          reject(err);
        })
    });
  }
}


