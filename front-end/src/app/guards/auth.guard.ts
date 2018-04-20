import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.authService.getMe()
          .then(me => {
            if (me) {
              localStorage.setItem('isLoggedIn', 'true');
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