import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { HttpClientService } from '../../services/http-client.service';
import { DatePipe } from '@angular/common';
import { FvState } from '../../state-managements/states/app.states';
import * as fvInfoActions from '../../state-managements/actions/fv-info.action';
import * as fvInfoReducer from '../../state-managements/reducers/fv-info.reducer';
import { TagService } from '../../services/tag.service';
declare var $: any

@Component({
    selector: 'app-datetime-control',
    templateUrl: './datetime-control.component.html',
    styleUrls: ['./datetime-control.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatetimeControlComponent implements OnInit {
    @Output() selectedTimer = new EventEmitter();
    @Output() showLoggerEmit = new EventEmitter();

    @Input() selectAll = false
    @Input() searchTitle = 'OK'
    @Input() display = true
    @Input() loading: boolean
    prefix: string
    vesselInfoActive: any
    start: Date
    end: Date
    tags: any[] = []
    displayDialog: boolean = false
    period: string
    vesselSub: Subscription;

    tagGroup = {
        fav: {
            group: ["FAV"],
            tags: []
        },
        ves: {
            group: ["VES"],
            tags: []
        },
        pme: {
            group: ["PME", "PPS"],
            tags: []
        },
        sme: {
            group: ["SME", "SPS"],
            tags: []
        },
        cme: {
            group: ["CME", "CPS"],
            tags: []
        },
        pae: {
            group: ["PAE"],
            tags: []
        },
        cae: {
            group: ["CAE"],
            tags: []
        },
        sae: {
            group: ["SAE"],
            tags: []
        },
        dg1: {
            group: ["DG1"],
            tags: []
        },
        dg2: {
            group: ["DG2"],
            tags: []
        },
        dg3: {
            group: ["DG3"],
            tags: []
        },
        dg4: {
            group: ["DG4"],
            tags: []
        }
    }

    headers: any = {
        ves: false,
        pme: false,
        cme: false,
        sme: false,
        pae: false,
        cae: false,
        sae: false,
        dg1: false,
        dg2: false,
        dg3: false,
        dg4: false
    }

    constructor(private http: HttpClientService,
        private datePipe: DatePipe,
        private store: Store<FvState>,
        private cd: ChangeDetectorRef,
        private tagService: TagService) { }

    get tagCount(): string {
        let count = 0
        for (let t in this.tagGroup) {
            count += this.tagGroup[t].tags.filter(x => x.check == true).length
        }

        let str: string
        if (count == 0)
            str = `select tags.`
        else
            str = `Selected ${count} tags.`
        return str;
    }



    ngOnDestroy() {
        if (this.vesselSub != null && !this.vesselSub.hasOwnProperty('unsubscribe')) {
            this.vesselSub.unsubscribe()
        }

    }

    ngOnInit() {
        $(document).on('click', '.control-report .dropdown-menu', function (e) {
            e.stopPropagation();
        });

        let now = new Date()
        this.end = new Date()
        this.start = new Date(now.setDate(now.getDate() - 1))
        this.store.select(fvInfoReducer.getFvInfosActive).retry(2).subscribe((res: any) => {
            if (res && res.fvInfo.prefix != this.prefix) {
                this.prefix = res.fvInfo.prefix
                this.vesselInfoActive = res.fvInfo
                // this.clearListActive()
                if(!this.tagService.presetConfig){
                    this.http.getJsonFile('/assets/tags/data-logger-preset.config.json').subscribe((res: any[]) => {
                        this.tagService.presetConfig = res
                        this.tagGroup.fav.tags = res
                        this.getPoints(this.prefix)
                    })
                }
               else{
                this.tagGroup.fav.tags = this.tagService.presetConfig
                this.getPoints(this.prefix)
               }
            }
        })
    }

    getPoints(prefix: string) {

        if(!this.tagService.hasPoint(prefix)){
            this.http.getPoints(prefix).retry(3).subscribe((res: any[]) => {
                res = res.filter(x => !x.tagName.endsWith("FOUT-TOTAL") && !x.tagName.endsWith("FIN-TOTAL") && !x.tagName.endsWith("RUN-HOURS") && !x.tagName.endsWith("RATE"))
      
                this.tags = []
                for (let r of res) {
                    this.tags.push({
                        name: r.tagName,
                        tagName: r.tagName,
                        check: false
                    })
                }
                this.getTagGroup()
                this.getTagSelected()
                this.tagService.addPoint(prefix,res)
            })
        }
        else{
            
            this.tags = []
            let point =  this.tagService.getPoint(prefix)

                for (let r of point) {
                    this.tags.push({
                        name: r.tagName,
                        tagName: r.tagName,
                        check: false
                    })
                }
                this.getTagGroup()
                this.getTagSelected()
        }

    }

    getTagGroup() {
        Object.keys(this.tagGroup).forEach(this.tagCallBack.bind(this))
    }

    tagCallBack(key: string) {
        var groupname = this.tagGroup[key].group
        if (key != "fav")
            this.tagGroup[key].tags = []
        for (let g of groupname) {
            var resTags = this.tags.filter(x => x.tagName.indexOf(g) > -1)
            if (resTags.length > 0)
                this.tagGroup[key].tags = this.tagGroup[key].tags.concat(resTags)
        }

    }

    selectPeriod(period: string) {
        $('.dropdown-toggle').dropdown()
        this.period = period
        let end = new Date()
        let start = new Date()
        let num = parseFloat(period.replace(/[^0-9\.]+/g, ""));

        if (period == "T") {
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
        }
        else if (period == "Y") {
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            start.setDate(start.getDate() - 1)

            end.setHours(0)
            end.setMinutes(0)
            end.setSeconds(0)
        }
        else if (period == "M") {
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)
            start.setDate(1)
        }
        else if (period.indexOf('H') > -1) {
            start.setHours(start.getHours() - num)
        }
        else if (period.indexOf('W') > -1) {
            start.setDate(start.getDate() - (num * 7))
        }
        else if (period.indexOf('M') > -1) {
            start.setDate(start.getDate() - (num * 30))
        }

        this.end = new Date(end)
        this.start = new Date(start)
    }

    serch() {
        let start = Date.parse(this.datePipe.transform(this.start.getTime(), 'yyyy/MM/dd HH:mm:ss'))
        let end = Date.parse(this.datePipe.transform(this.end.getTime(), 'yyyy/MM/dd HH:mm:ss'))
        if (isNaN(start)) {
            alert("Format start time invalid.")
            return
        }
        if (isNaN(end)) {
            alert("Format end time invalid.")
            return
        }

        let tags = this.addPrefix()

        if (tags.length == 0) {
            alert('Please select tags.')
            return
        }
        let data = {
            start: start,
            end: end,
            tags: tags,
            fvInfo: this.vesselInfoActive
        }
        this.selectedTimer.emit(data)
    }

    addPrefix(): any[] {
        let tagsRes: any[] = []
        for (let ts in this.tagGroup) {
            let tags = this.tagGroup[ts].tags.filter(x => x.check == true)
            for (let t of tags) {
                tagsRes.push({
                    name: t.name,
                    tagName: this.prefix + "-" + t.tagName
                })
            }
        }
        return tagsRes
    }

    all(val: boolean) {
        if (val)
            this.tags.forEach(x => x.check = true)
        else
            this.tags.forEach(x => x.check = false)
    }

    onInput() {
        this.period = ""
    }

    selectFav(fav: any) {
        if (fav.name == "All") {
            for (let r in this.tagGroup) {
                if (r != "fav") {
                    for (let r1 of this.tagGroup[r].tags) {
                        r1.check = true
                        this.tagService.setActive(r1, this.tagGroup[r])
                    }
                }
            }
        }
        else {
            this.clearListActive()
            let tags: any[] = fav.tags
            let tagNames = tags.map(x => x.tagName)
            for (let r in this.tagGroup) {
                if (r != "fav") {
                    let res = this.tagGroup[r].tags.filter(x => tagNames.indexOf(x.tagName) > -1)
                    for (let r1 of res) {
                        r1.check = true
                        this.tagService.setActive(r1, this.tagGroup[r])
                    }
                }
            }
            let preset = this.tagGroup
        }

    }

    clearListActive() {
        for (let r in this.tagGroup) {
            if (r != "fav") {
                for (let v of this.tagGroup[r].tags) {
                    v.check = false
                }
            }
        }
        this.tagService.clearTagSelected()
    }

    selectedTag(tag: any, group: any) {
        tag.check = !tag.check;
        this.tagService.setActive(tag, group);
    }

    closeDialog() {
        this.displayDialog = false

    }

    confirmTag() {
        this.displayDialog = false
    }

    selectedAll(tags: any) {
        for (let t of tags) {
            t.check = true
        }
    }

    selectHaederAll(head: any, data: any[],group:any) {
        this.headers[head] = !this.headers[head]

        for (let d of data) {
            d.check = this.headers[head]
            this.tagService.setActive(d, group)
        }
    }

    showLogger() {

        let start = Date.parse(this.datePipe.transform(this.start.getTime(), 'yyyy/MM/dd HH:mm:ss'))
        let end = Date.parse(this.datePipe.transform(this.end.getTime(), 'yyyy/MM/dd HH:mm:ss'))

        if (isNaN(start)) {
            alert("Format start time invalid.")
            return
        }
        if (isNaN(end)) {
            alert("Format end time invalid.")
            return
        }

        let tags = this.addPrefix()

        if (tags.length == 0) {
            alert('Please select tags.')
            return
        }
        let time = {
            start: start,
            end: end,
            tags: tags,
            fvInfo: this.vesselInfoActive
        }

        this.showLoggerEmit.emit(time)
    }

    getTagSelected() {
        Object.keys(this.tagGroup).forEach(x => {
            let filter = this.tagService.tagSelected.filter(t => t.group.join(',') === this.tagGroup[x].group.join(','))
            for (let f of filter) {
                let _tags = this.tagGroup[x].tags.filter(x => x.name == f.tags)
                for(let _tag of _tags){
                    _tag.check = true
                }
                
            }
        })
        this.cd.markForCheck()
    }
}