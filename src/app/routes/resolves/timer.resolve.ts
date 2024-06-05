import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import { HttpClientService } from '../../services/http-client.service';

@Injectable()
export class TimerResolver implements Resolve<Observable<number>>{
    constructor(private httpService : HttpClientService){}

    resolve() : Observable<number> { 
        return this.httpService.getJsonFile('assets/general.config.json')
            .map((res:any) => {
                return res.timer
            })
    }
}