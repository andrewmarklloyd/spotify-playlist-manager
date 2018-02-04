import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {

  constructor(private http: Http) {

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

  registerUser(email, password) {
		return new Promise((resolve, reject) => {
			this.http.post(`${environment.apiDomain}api/user/register`, {email, password})
				.toPromise()
				.then(res => {
					resolve(res.json())
				})
		})
  }
}
