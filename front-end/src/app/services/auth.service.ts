import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class AuthService {

  constructor(private http: Http) {

  }

  getAuthUrl() {
		return new Promise((resolve, reject) => {
			this.http.get('http://localhost:3000/api/user/auth-url')
				.toPromise()
				.then(res => {
					resolve(res.json().authUrl)
				})
		})
  }

  submitAccessCode(accessCode) {
		return new Promise((resolve, reject) => {
			this.http.post('http://localhost:3000/api/user/code', {accessCode: accessCode})
				.toPromise()
				.then(res => {
					resolve(res.json())
				})
		})
  }
}
