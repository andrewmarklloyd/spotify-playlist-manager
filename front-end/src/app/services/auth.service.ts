import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable()
export class AuthService {

  constructor(private http: Http,
  						public router: Router,
              private storageService: StorageService) {
  }

  public getSpotifyAuthUrl(authType) {
		return new Promise((resolve, reject) => {
      const options = new RequestOptions({ params: { authType } })
			this.http.get(`${environment.apiDomain}api/auth/auth-url`, options)
				.toPromise()
				.then(res => {
					resolve(res.json().authUrl)
				})
        .catch(err => {
          alert(err)
        })
		})
  }

  public getToken() {
    const token = this.storageService.getItem('token');
    return token;
  }

  public isLoggedIn() {
    return this.getToken() != null;
  }

  public getMe() {
    return new Promise((resolve, reject) => {
      const headers = new Headers({ 'Authorization': 'Bearer ' + this.storageService.getItem('token') });
      const options = new RequestOptions({ headers: headers });
      this.http.get(`${environment.apiDomain}api/user/me`, options)
        .toPromise()
        .then(res => {
          resolve(res.json())
        }).catch(err => {
          reject(err)
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

  public logout(): void {
    this.storageService.removeItem('token');
  }

  public createPlaylist() {
    return new Promise((resolve, reject) => {
      const userId = this.storageService.getItem('userId');
      this.http.post(`${environment.apiDomain}api/user/create-playlist`, { userId })
        .toPromise()
        .then(response => {
          resolve(response.json());
        }).catch(err => {
          reject(err);
        })
    });
  }
}
