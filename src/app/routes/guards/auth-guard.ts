import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let url: string = state.url;
        return await this.checkLogin(url);
    }

    async checkLogin(url: string) {
        if (localStorage.getItem('vesselToken')) {
            var res = await this.authService.tryLogin()
            if (res)
                return res
        }
        this.authService.redirectUrl = url;
        this.router.navigate(['/login']);
        return false;
    }
}