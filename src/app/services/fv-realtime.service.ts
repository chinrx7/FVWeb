import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
import { FvState } from '../state-managements/states/app.states';
import * as fvInfoActions from '../state-managements/actions/fv-info.action';
import * as fvInfoReducer from '../state-managements/reducers/fv-info.reducer';
import { Store } from '@ngrx/store';
import { FV, FvInfo } from '../state-managements/models/fv.model';
import { HttpClientService } from '../services/http-client.service';

@Injectable()
export class FvRealtimeService {
    
    timer: Subscription;
    interval: number;
    fvInfos: FvInfo[] = []
    realtimeTags: any[] = []

    loadedVessels: string[] = [];

    constructor(private store: Store<FvState>,
        private http: HttpClientService) {

    }

    start(interval: number) {
        this.http.getJsonFile('/assets/tags/dashboard.tag.json').subscribe(res => {
            Object.keys(res).forEach((k1) => {
                Object.keys(res[k1]).forEach((k2) => {
                    let tag = res[k1][k2]
                    this.realtimeTags.push({
                        name: tag.name,
                        tagName: tag.tagName,
                        cal: tag.cal,
                    })

                });
            });
            this.iniRealtime()
        })
    }

    iniRealtime() {
        this.store.select(fvInfoReducer.getFvInfosActive).subscribe((res: any) => {
            if (res) {
                let payload = this.generateTags(res)
                // console.log(payload)
                if(payload)
                    this.store.dispatch(new fvInfoActions.SetRealtimeActive(payload))
            }
        })

        // setTimeout(() => {
        //     this.store.select(fvInfoReducer.getFvNoData).subscribe(res => {
   
        //         let offset = 1;
        //         for (let r of res) {
        //             this.setDelay(offset++, r)
        //         }
        //     })
        // }, 1000);


           setTimeout(() => {
            this.store.select(fvInfoReducer.getFvNoData).subscribe(res => {
                // console.log('FV Nodata');
                // console.log(res);
                let offset = 1;
                for (let r of res) {
                    this.setDelay(offset++, r)
                }
            })
        }, 250);

    }


    setDelay(offset, res) {
        setTimeout(() => {
            // get data each fv here !!!
            let isLoaded = this.loadedVessels.includes(res.fvInfo.prefix);
            // console.log(res.fvInfo.prefix);
            // console.log(isLoaded);
            if(!isLoaded)
            {
                this.loadedVessels.push(res.fvInfo.prefix);
                let payload = this.generateTags(res)
                if(payload)
                    this.store.dispatch(new fvInfoActions.SetRealtimeActive(payload))
            }
        }, offset * 100);
    }

    stop() {
        if (this.timer != null && !this.timer.hasOwnProperty('unsubscribe')) {
            this.timer.unsubscribe();
        }
    }

    generateTags(res: any) {
        if (res) {
            let tags: any[] = []
            for (let t of this.realtimeTags) {
                tags.push({
                    name: t.name,
                    tagName: `${res.fvInfo.prefix}-${t.tagName}`,
                    cal: t.cal,
                })
            }
            if (tags.length > 0) {
                let payload = {
                    tags: tags,
                    fv: res.fvInfo
                }
                return payload
            }
            else
                return null
        }
    }
}