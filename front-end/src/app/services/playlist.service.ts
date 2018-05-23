import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable()
export class PlaylistService {

  constructor(private http: Http,
  						private storageService: StorageService) { }
}
