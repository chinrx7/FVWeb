import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fvInfoActions from '../actions/fv-info.action';
import * as fvInfoReducer from '../../state-managements/reducers/fv-info.reducer';
import { HttpClientService } from '../../services/http-client.service';
import { AppState } from '../../state-managements/states/app.states';
import { FvInfo, FV } from '../models/fv.model';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/withLatestFrom'
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import { zip,merge,map,switchMap,mergeMap } from 'rxjs/operators';
// import {  } from 'rxjs/operator/map';

@Injectable()
export class FvInfoEffects {

    constructor(private actions$: Actions, private http: HttpClientService, private store: Store<AppState>) {

    }

    @Effect() loadFvInfos$ = this.actions$
        .ofType(fvInfoActions.INIT_FV_INFO)
        // .debounceTime(1000)
        .withLatestFrom(this.store.select(fvInfoReducer.getFvInfoState), (action, filter) => {
            return filter
        })
        .switchMap(store =>
            this.http.getVesselInfo().retry(2)
                .map(todos => {
                    let _data: FV[] = []
                    for (let t of todos) {
                        let _currState = store.fvState.filter(x => x.fvInfo.name == t.name)
                        let _currData = (_currState.length > 0) ? _currState[0].data : []
                        let _fvInfo = {
                            desc: t.description,
                            img: t.image,
                            lat: t.lattitude,
                            long: t.longtitude,
                            name: t.name,
                            prefix: t.prefix,
                            active: false,
                            timestamp: new Date(t.timestamp)
                        }
                        _data.push({
                            fvInfo: _fvInfo,
                            data: _currData
                        })
                    }
                    let _active = store.fvState.filter(x => x.fvInfo.active == true)
                    if (_active.length > 0) {
                        let _match = _data.filter(x => x.fvInfo.name == _active[0].fvInfo.name)
                        if (_match.length > 0) {
                            _match[0].fvInfo.active = true
                        }
                    }
                    else {
                        _data[0].fvInfo.active = true
                    }
                    return _data;
                }))
        .mergeMap(payload => {
            return [
                new fvInfoActions.GetFvInfoSuccess(payload)
            ]
        })

    @Effect() setFvActive$ = this.actions$
        .ofType(fvInfoActions.SET_FV_ACTIVE)
        .switchMap((toPayload: any) => {
            return Observable.of(toPayload.payload)
        })
        .withLatestFrom(
        this.store.select(fvInfoReducer.getFvInfoState),
        (payload, store) => {
            let _prevActive = store.fvState.filter(x => x.fvInfo.active == true)
            if (_prevActive.length > 0)
                _prevActive[0].fvInfo.active = false
            let _active = store.fvState.filter(x => x.fvInfo.name == payload.name)
            if (_active.length > 0) {
                _active[0].fvInfo.active = true
            }
            return new fvInfoActions.SetFvActiveSuccess(store.fvState)
        })



        
    @Effect() setFvDataActive$ = this.actions$
    .ofType(fvInfoActions.SET_REALTIME_ACTIVE)
    .flatMap((toPayload: any) => {
        return this.http.getCurrentValues(toPayload.payload.tags)
            .map((res: any) => {
                return {
                    data: res,
                    fv: toPayload.payload.fv
                }
            })
    })
    .map(res => {
        let data = {}
        for (let r of res.data) {
            data[r.name] = {}
            data[r.name].value = r.value
            data[r.name].name = r.name
            data[r.name].tagName = r.tagName
            data[r.name].timestamp = r.dateTime
            data[r.name].cal = r.cal
        }
        res.data = data
        return new fvInfoActions.SetRealtimeActiveSuccess(res)
    })
}

