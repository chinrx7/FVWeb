import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FvState } from '../../state-managements/states/app.states';
import * as fvOverviewReducer from '../../state-managements/reducers/fv-overview.reducer';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {

    windowWidth: number
    data: any[] = []
    blankData: any[] = []

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.windowWidth = event.target.innerWidth;
    }

    constructor(private store: Store<FvState>,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.windowWidth = document.body.clientWidth;
        this.store.select(fvOverviewReducer.getFvOverviewData).subscribe(res => {
            if (res) {
                let id = 1
                for (let r of res) {
                    let newData = {}
                    if(r.datas)
                    {
                        for (let d of r.datas) {
                            newData[d.name] = {}
                            newData[d.name].value = d.value
                            newData[d.name].timestamp = d.dateTime
                            newData[d.name].tagName = d.tagName
                        }

                        r['newData'] = newData
                        r['id'] = id++
                    }
                }
                this.data = res
                let dataCount = 0;
                if(this.data) {dataCount = this.data.length;}
                let remain =  7 - dataCount;
                if(dataCount > 0){
                    let arr : any[] = []
                    for(let i=0;i<remain;i++){
                        var clone = {}
                        clone['id'] = null
                        arr.push(clone)
                      
                    }
                    this.blankData = arr
                }
              
            }
        })
    }

    ngOnDestroy() {

    }


}