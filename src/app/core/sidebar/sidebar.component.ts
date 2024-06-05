import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import { FvTimeService } from '../../services/fv-time.service';
// import { FvRealtimeService } from '../../services/fv-realtime.service';
// import { FvInfoService } from '../../services/fv-info.service';
import { HttpClientService } from '../../services/http-client.service';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

import { Store } from '@ngrx/store';
import { FvState } from '../../state-managements/states/app.states';
import { FvInfo, FV } from '../../state-managements/models/fv.model';
import { Observable } from 'rxjs/Observable';
import * as fvInfoReducer from '../../state-managements/reducers/fv-info.reducer';
import * as fvInfoActions from '../../state-managements/actions/fv-info.action';
import { CoordinatesService } from '../../services/coordinate.service';


@Component({
    selector: '[app-sidebar]',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

    fvinfos$: Observable<FvInfo[]>;
    fvActive$: Observable<FV>;
    vesselsSelected: any[] = []
    keyword: string
    isShowMenu: boolean = false;
    isSm = false;

    fvTimeService:FvTimeService;
    coordinatesService:CoordinatesService;


    @Output() selectedVessel = new EventEmitter();

    constructor(
        private store: Store<FvState>,
        fvTimeService: FvTimeService,
        coordinatesService: CoordinatesService,
        private http: HttpClientService,
        breakpointObserver: BreakpointObserver,
        
    ) {
        this.fvinfos$ = this.store.select(fvInfoReducer.getFvInfos)
        this.fvActive$ = this.store.select(fvInfoReducer.getFvInfosActive)

        this.fvTimeService = fvTimeService;
        this.coordinatesService = coordinatesService;

        breakpointObserver
            .observe(['(max-width: 991px)'])
            .subscribe((state: BreakpointState) => {
                if (state.matches) {
                    this.isSm = true;
                    this.isShowMenu = false;
                
                } else {
                    this.isSm = false;
                    this.isShowMenu = true;
                }
                // this.updateMenuState();

                // console.log("breakpoint");
            });
    }

    ngOnInit() {
       
    }
  

    toggle()
    {
        this.isShowMenu = !this.isShowMenu;
    }

    ngOnDestroy() {
        // this.fvInfoService.stop()
    }

    // updateMenuState()
    // {
    //     if(!this.isSm){return true;}
    //     else {return this.isSm && this.isShowMenu;}
    // }


    selectVessel(vessel: FvInfo) {
        if(this.isSm) { this.isShowMenu = false; }
        this.store.dispatch(new fvInfoActions.SetFvActive(vessel));
        this.selectedVessel.emit(vessel);        
    }

    searchVessel(keyword: string) {
        this.keyword = keyword
    }

    fvFilter(fv) {
        if (this.keyword) {
            return fv.filter(x =>
                x.name.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1 ||
                x.desc.toLowerCase().indexOf(this.keyword.toLowerCase()) > -1
            )
        }
        else
            return fv
    }
}
