import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
import { FvState } from '../state-managements/states/app.states';
import * as fvInfoActions from '../state-managements/actions/fv-info.action';
import * as fvInfoReducer from '../state-managements/reducers/fv-info.reducer';
import * as fvOverviewActions from '../state-managements/actions/fv-overview.action';
import * as fvOverviewReducer from '../state-managements/reducers/fv-overview.reducer';
import { Store } from '@ngrx/store';
import { FV, FvInfo } from '../state-managements/models/fv.model';
import { HttpClientService } from '../services/http-client.service';

@Injectable()
export class FvOverviewService {

    timer: Subscription;
    interval: number;
    fvInfos: FvInfo[] = []
    overviewTags: any[] = []
    overviewDatas: any[] = []
    constructor(private store: Store<FvState>,
        private http: HttpClientService) {

    }

    start(interval: number) {
        let timer = Observable.timer(interval,interval);
        this.timer = timer.subscribe(t => {
            this.tick();
        })

        this.http.getJsonFile('/assets/tags/overview.tag.json').subscribe(res => {
            Object.keys(res).forEach((k1) => {
                let tag = res[k1];
                this.overviewTags.push({
                    name: tag.name,
                    tagName: tag.tagName,
                    cal: tag.cal,
                });
                
            });
            this.initRealtime()
        })
    }

    tick(){
        if(this.overviewDatas.length > 0){
            this.store.dispatch(new fvOverviewActions.GetFVOverview(this.overviewDatas))
        }
    }

    initRealtime() {
        this.store.select(fvInfoReducer.getFvInfo).subscribe((res: any) => {
            if(res && this.overviewDatas.length == 0){
                this.overviewDatas = []
                for(let r of res){
                    this.overviewDatas.push(this.generateTags(r))
                }
                this.store.dispatch(new fvOverviewActions.GetFVOverview(this.overviewDatas))
            }
        })
    }

    stop() {
        if (this.timer != null && !this.timer.hasOwnProperty('unsubscribe')) {
            this.timer.unsubscribe();
        }
    }

    generateTags(res: any) {
       if (res) {
            let tags: any[] = []
            for (let t of this.overviewTags) {
                tags.push({
                    name: t.name,
                    tagName: `${res.prefix}-${t.tagName}`,
                    cal: t.cal,
                })
            }
            if (tags.length > 0) {
                let payload = {
                    tags: tags,
                    fv: res
                }
                return payload
            }
            else
                return null
        }
    }
}