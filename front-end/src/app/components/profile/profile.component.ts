import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: Object = {};

  constructor(private userService: UserService) { }

  ngOnInit() {
  	this.userService.getMe()
  		.then(res => {
        this.user = res['user'];
        this.getProfile()
  		})
  }

  getProfile() {
  	this.userService.getProfile()
  		.then(res => {
        console.log(res)
  		})
  }
}
