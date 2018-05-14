import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private authService: AuthService,
                private storageService: StorageService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.getMe()
          .then(me => {
            console.log('auth guard')
            if (me) {
              this.storageService.setItem('isLoggedIn', 'true');
              return Promise.resolve(true)
            } else {
              this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
              return Promise.resolve(false);
            }
          })
          .catch(err => {
            return Promise.resolve(false);
          })
        }
}