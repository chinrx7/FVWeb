import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { URL } from './api.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
const URL = environment.API_URL;
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { SecurityService } from './security.service';
import { AuthService } from './auth.service';

@Injectable()
export class HttpClientService {
    constructor(private http: HttpClient, private router: Router, private securityService: SecurityService, private authService:AuthService) {

    }

    getJsonFile(path: string) {
        return this.http.get(path)
    }

    getVesselInfo(): Observable<any> {
        return this.http.post(URL + "/api/vessels/getvesselcurrentInfo", null, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('vesselToken')}`)
        }).map((res: any[]) => res.filter(x => this.securityService.hasAccess(x.name)).sort(this.compare)).catch((err: any) => {
            if (err.status == 401)
            {
                if(this.tryLogin()) { this.getVesselInfo(); }
                else { this.router.navigate(['/login']); }
            }
            return err
        })
    }
    compare( a, b ) {
        if ( a.name < b.name ){
          return -1;
        }
        if ( a.name > b.name ){
          return 1;
        }
        return 0;
      }
    tryLogin() : boolean
    {
        let username = localStorage.getItem('username');
        let password = localStorage.getItem('password');

        if(username && password && username.length > 0 && password.length > 0)
        {
            let loginResult = this.authService.login(username,password);

            if(loginResult) { return true; }
            else { return false; }
        }

        return false;
    }

    getAddress(lat: string, long: string, apiKey: string): Observable<any> {
        if (lat && long) {
            return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`)
        } else {
            return Observable.of(null);
        }
    }

    getPoints(prefix: string) {
        return this.http.post(URL + "/api/vessels/getpoints", {
            prefix: prefix
        }, {
                headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('vesselToken')}`)
            }).map(res => res).catch((err: any) => {
                // if (err.status == 401)
                //     this.router.navigate(['/login']);

                    if (err.status == 401)
                    {
                        if(this.tryLogin()) { this.getPoints(prefix); }
                        else { this.router.navigate(['/login']); }
                    }


                return err
            })
    }


    getLoggerKey(start: string, end: string, tags: string[]) {
        let body = {
            StartTime: start,
            EndTime: end,
            TagNames: tags
        }
        return this.http.post(URL + "/api/vessels/GetLogggerKey", body, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('vesselToken')}`),
        }).map(res => res).catch((err: any) => {
            // if (err.status == 401)
            //     this.router.navigate(['/login']);

                if (err.status == 401)
                {                    
                    if(this.tryLogin()) { this.getLoggerKey(start, end, tags); }
                    else { this.router.navigate(['/login']); }
                }

            return err
        })
    }

    loadFile(key: string, name: string) {
        window.open(URL + `/api/vessels/GetLoggerFile/${key}/${name}`, '_self')
    }

    getRawData(start: string, end: string, tags: any[]) {
        let body = {
            StartTime: start,
            EndTime: end,
            HistorianTag: tags
        }

        return this.http.post(URL + "/api/vessels/loggergethistorianvalues", body, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('vesselToken')}`)
        }).map(res => res).catch((err: any) => {
            // if (err.status == 401)
            //     this.router.navigate(['/login']);

                if (err.status == 401)
                {
                    if(this.tryLogin()) { this.getRawData(start, end, tags); }
                    else { this.router.navigate(['/login']); }
                }
            return err
        })
    }

    getChartRawData(start: string, end: string, tags: any[]) {
        let body = {
            StartTime: start,
            EndTime: end,
            HistorianTag: tags
        }
        return this.http.post(URL + "/api/vessels/ChartGetHistorianValues", body, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('vesselToken')}`)
        }).map(res => res).catch((err: any) => {
            // if (err.status == 401)
            //     this.router.navigate(['/login']);

                if (err.status == 401)
                {
                    if(this.tryLogin()) { this.getChartRawData(start, end, tags); }
                    else { this.router.navigate(['/login']); }
                }
            return err
        })
    }

    getReport(reportType:string,timestamp:string,fvName:string){
        let body = {
            reportType : reportType,
            timestamp : timestamp,
            fvName:fvName
        }

        return this.http.post(URL + "/api/vessels/GetReport",body,{
           responseType:  'arraybuffer',
            headers : new HttpHeaders().set('Authorization',`Bearer ${localStorage.getItem('vesselToken')}`)
        }).map((res:any) => {
            return new Blob([res], { type: 'application/pdf' })
        }).catch((err:any) => {
            // if(err.status == 401)
            // this.router.navigate(['/login']);

            if (err.status == 401)
            {
                if(this.tryLogin()) { this.getReport(reportType, timestamp, fvName); }
                else { this.router.navigate(['/login']); }
            }

            return err
        })
    }



    // getOverviewCurrentsValues(tagNames: any[]) {
    //     return this.http.post(URL + "/api/vessels/getcurrentvaluesoverview", tagNames.map(r => r.tags), {
    //         headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('vesselToken')}`)
    //     }).map(res => res).catch((err: any) => {
    //         if (err.status == 401)
    //             this.router.navigate(['/login']);
    //         return err
    //     })
    // }

    getCurrentValues(tagNames: any[]) {
    
        // console.log(tagNames);
        return this.http.post(URL + "/api/vessels/getcurrentvalues", tagNames, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('vesselToken')}`)
        }).map(res => res).catch((err: any) => {
            // if (err.status == 401)
            //     this.router.navigate(['/login']);
           

                if (err.status == 401)
                {
                    if(this.tryLogin()) { this.getCurrentValues(tagNames); }
                    else { this.router.navigate(['/login']); }
                }
            return err
        })
    }

    getOverviewCurrentsValues(tagNames: any[]) {
      
        let tags = [].concat.apply([],tagNames.map(r => r.tags));
        
        return this.http.post(URL + "/api/vessels/getcurrentvalues", tags, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('vesselToken')}`)
        }).map(res => res).catch((err: any) => {
            // if (err.status == 401)
            //     this.router.navigate(['/login']);

            

                if (err.status == 401)
                {
                    if(this.tryLogin()) { this.getOverviewCurrentsValues(tagNames); }
                    else { this.router.navigate(['/login']); }
                }
            return err
        })
    }
    
}



