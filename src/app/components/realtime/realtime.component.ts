import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router'
import { FvState } from '../../state-managements/states/app.states';
import * as fvRealtimeReducer from '../../state-managements/reducers/fv-info.reducer';
import { Observable } from 'rxjs/Observable';
import * as fvInfoReducer from '../../state-managements/reducers/fv-info.reducer';
import * as fvInfoActions from '../../state-managements/actions/fv-info.action';
import { withLatestFrom, map } from 'rxjs/operators';
import { RealTimeDisplaySetting, RealTimeType } from './realtime-display.model';
import { empty } from 'rxjs/Observer';
import { forEach } from '@angular/router/src/utils/collection';
import { NOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR } from '@angular/core/src/view/provider';

import { CardInfo, CardDetail } from './models/card-info.model';
import { CardConfiguration } from './card-config';
import { D } from '@angular/core/src/render3';


@Component({
    selector: 'app-realtime',
    templateUrl: './realtime.component.html',
    styleUrls: ['./realtime.component.css']
})
export class RealtimeComponent implements OnInit {
    data$: Observable<any>
    cardInfos: CardInfo[] = [];
    
    constructor(private store: Store<FvState>, private route: ActivatedRoute) {
        let withLast = this.route.params.pipe(
            withLatestFrom(this.store.select(fvInfoReducer.getFvInfos)),
            map(([route, store]) => {
                let data = {
                    route: route,
                    store: store
                }
                console.log(data);
                return data
            })
        )

        withLast.subscribe(r => {
            if (r && r.store && r.store.length > 0 && r.route && r.route.hasOwnProperty('id')) {
                let id = r.route['id']
                var match = r.store.filter(x => x.prefix.toLowerCase() == id.toLowerCase())
                if (match && match.length > 0) {
                     this.store.dispatch(new fvInfoActions.SetFvActive(match[0]))
                }
            }
            //console.log(r)
        })

        this.cardInfos = new CardConfiguration().getConfig();
        //console.log(this.cardInfos)
    }

    getCardDetail(tag, row, col):CardDetail {
        if(tag && tag.tagName) {
            let matchInfos = this.cardInfos.filter(x => tag.tagName.startsWith(x.prefix));

            if(matchInfos && matchInfos[0] && matchInfos[0].details) {
                let info = matchInfos[0];
                let matchCards = info.details.filter(x => x.row === row && x.col === col);

                if(matchCards) {
                    return matchCards[0];
                }
            }
            //console.log(matchInfos);
            return null;
        } 
    }

    ngOnInit() {
        this.data$ = this.store.select(fvRealtimeReducer.getFvRealtimeData)
        // this.router.events.subscribe((evt) => {
        //     if (!(evt instanceof NavigationEvent)) {
        //         return;
        //     }
        //     window.scrollTo(0, 0)
        // });
        //console.log(this.data$)
    }

    getHour(timestamp) {
        if(timestamp) {
            let dt = new Date(timestamp);
            let hour = dt.getHours() + dt.getMinutes()/60;
            return hour;
        }
        else { 
            return 1; 
        }
    }

    abs(data) {
        if(data != undefined) {
            if(+data.value < 0) { data.value = '0'; }
            return data;
        }
        return data;
    }

    getAvg(data) {      
        if(data != undefined) {
            //let prefix = data.tagName.substring(0,3);
            let prefix = data.tagName.substring(0, data.tagName.search("-"));
            let value = (+data.value) / +this.getHour(data.timestamp);
            
            return {
                name: '',
                tagName: data.tagName + '-AVG',
                timestamp: new Date(),
                value: value.toString() ,
                cal: false        
            }
        }
        else { 
            return {
                name: '',
                tagName: '-AVG',
                timestamp: new Date(),
                value: '0' ,
                cal: false        
            };
        }
    }

    getSum(...datas)
    {       
        if(datas != undefined)
        {
            let total = 0;
            let prefix = '';
                        
            datas.forEach(data => {
                if(data && data.value) {
                    prefix = data.tagName.toString();
                    total += (+data.value) > 0 ? +data.value : 0;
                    
                }
            });
            return {
                name: '',
                tagName: prefix,
                timestamp: new Date(),
                value: total.toString() ,
                cal: false        
            }
        }
        else {
            return  {
                name: '',
                tagName: '',
                timestamp: new Date(),
                value: '0' ,
                cal: false           
            };
        }
    }
}
