import { Injectable, transition } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { URL } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment';
const URL = environment.API_URL;

@Injectable()
export class AuthService {
    redirectUrl: string;
    constructor(private http: HttpClient) {
     console.log(URL)
    }

    async login(username: string, password: string) {
        let body = `grant_type=password&username=${username}&password=${password}`

        try {
            var res: any = await this.http.post(URL + '/token', body, {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
            }).toPromise()
            if (res.access_token) {
                localStorage.setItem('vesselToken', res.access_token);
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                return true
            }
            else {
                return false
            }
        }
        catch (err) {
            return false
        }
    }

    async tryLogin() {
        try {
            var res: any = await this.http.post(URL + '/api/users/trytologin', null, {
                headers: new HttpHeaders().set('Authorization', `bearer ${localStorage.getItem('vesselToken')}`)
            }).toPromise()
            return res
        }
        catch (err) {
             let successLogin = this.tryLoginUserPass();
            return successLogin;
        }
    }

    async tryLoginUserPass()
    {
        let username = localStorage.getItem('username');
        let password = localStorage.getItem('password');

        if(username && password && username.length > 0 && password.length > 0)
        {
            let loginResult = await this.login(username,password);

            if(loginResult) { return true; }
            else { return false; }
        }

        return false;
    }

    logout(): void {
        localStorage.removeItem('vesselToken')
        localStorage.removeItem('username')
        localStorage.removeItem('password')
    }
}