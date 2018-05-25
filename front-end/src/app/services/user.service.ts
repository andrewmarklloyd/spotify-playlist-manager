import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable()
export class UserService {

  constructor(private http: Http,
  						private storageService: StorageService) { }

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

  public getProfile() {
    return new Promise((resolve, reject) => {
      const headers = new Headers({ 'Authorization': 'Bearer ' + this.storageService.getItem('token') });
      const options = new RequestOptions({ headers: headers });
      this.http.get(`${environment.apiDomain}api/user/profile`, options)
        .toPromise()
        .then(res => {
          resolve(res.json())
        }).catch(err => {
          reject(err)
        })
    })
  }

}
