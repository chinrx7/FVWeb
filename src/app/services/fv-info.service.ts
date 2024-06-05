import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map,filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
import { FvState } from '../state-managements/states/app.states';
import * as fvInfoActions from '../state-managements/actions/fv-info.action';
import * as fvInfoReducer from '../state-managements/reducers/fv-info.reducer';
import { Store } from '@ngrx/store';
import { FV,FvInfo } from '../state-managements/models/fv.model';
import 'rxjs/add/operator/take'
@Injectable()
export class FvInfoService {

    timer : Subscription;
    interval: number;
    fvInfos : FvInfo[] = []

    constructor(private store : Store<FvState>){
       
    }

    start(interval : number){
        let timer = Observable.timer(0,interval);
        this.timer = timer.subscribe(t => {
            this.tick();
        })
    }

    stop(){
        if (this.timer != null && !this.timer.hasOwnProperty('unsubscribe')) {
            this.timer.unsubscribe();
        }
    }

    tick(){
        this.store.dispatch(new fvInfoActions.InitialFVInfo)
    }
}