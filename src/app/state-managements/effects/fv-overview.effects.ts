import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fvOverviewActions from '../actions/fv-overview.action';
import * as fvOverviewReducer from '../../state-managements/reducers/fv-overview.reducer';
import { HttpClientService } from '../../services/http-client.service';
import { AppState } from '../../state-managements/states/app.states';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/withLatestFrom'

@Injectable()
export class FvOverviewEffects {

    constructor(private actions$: Actions, private http: HttpClientService, private store: Store<AppState>) {
    }

    @Effect() setFvDataActive$ = this.actions$
    .ofType(fvOverviewActions.GET_FV_OVERVIEW)
    .flatMap((toPayload:any) => {
        return this.http.getOverviewCurrentsValues(toPayload.payload).retry(2)
            .map((res: any) => {
               
                for(let r of res){
                    let tagname = r.tagName
                    let match = toPayload.payload.filter(x =>x.tags.map(x => x.tagName).indexOf(tagname) > -1)

                    if(match.length > 0){                                              
                        if(match[0].datas == undefined){match[0].datas = [];}
                        match[0].datas.push(r);
                    }
                }                          
                return toPayload.payload
            })
    })
    .map(res => {
        return new fvOverviewActions.GetFvOverviewSuccess(res)
    })
}

