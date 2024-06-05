import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClientService } from '../../services/http-client.service';
@Component({
    selector: 'app-data-logger',
    templateUrl: './data-logger.component.html',
    styleUrls: ['./data-logger.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataLoggerComponent implements OnInit {
    datahis: any[] = []
    headers: any[] = []
    loading: boolean = false
    start: Date
    end: Date
    tags: any
    pageRow:number = 100
    pages:string[] = []
    pageActive : number
    pageCount : number
    constructor(private datePipe: DatePipe,
        private http: HttpClientService,
        private changeDetectorRef: ChangeDetectorRef) {

    }

    ngOnInit() {
    }

    downloadLogger(event: any) {
        let _tags = event.tags.map(x => x.tagName);
        let start = this.datePipe.transform(event.start, "yyyy-MM-dd HH:mm:00")
        let end = this.datePipe.transform(event.end, "yyyy-MM-dd HH:mm:00")
        this.http.getLoggerKey(start, end, _tags).subscribe((res: any) => {
            this.http.loadFile(res, event.fvInfo.name)
        }, err => {
            alert('Cannot load data from server.')
        })

    }

    showLogger(event: any) {
        let start = new Date(event.start);
        let end = new Date(event.end);
        start.setSeconds(0);
        end.setSeconds(0);
        this.tags = event.tags
        this.start = start
        this.end = end
        let totalMiliseconds  = new Date(end).getTime() - new Date(start).getTime();
        let resultInMinutes = (totalMiliseconds / 60000);
        this.pageCount = Math.ceil(resultInMinutes / this.pageRow)
        this.pages = this.pagination(1,this.pageCount)
        this.pageActive = 1
        this.setDatetime(this.pageActive)
    }

    setDatetime(pageNum : number){
        let num = pageNum - 1
        let startRow = num * this.pageRow

        let start = new Date(this.start)
        start.setMinutes(start.getMinutes() + startRow)
    
        let end  : Date
        if(pageNum == this.pageCount){
            end = new Date(this.end)
        }
        else{
            end = new Date(this.start)
            end.setMinutes(end.getMinutes() + this.pageRow + startRow -1 )
        }
        let _start = this.datePipe.transform(start, "yyyy-MM-dd HH:mm:00")
        let _end = this.datePipe.transform(end, "yyyy-MM-dd HH:mm:00")
        this.getData(_start,_end,this.tags)
    }

    getData(startTime: string, endTime: string, tags: any) {
        this.headers = []
        this.datahis = []
        this.loading = true
        this.http.getRawData(startTime, endTime, tags).subscribe((res: any) => {
            this.loading = false
            this.headers = res.headers
            this.datahis = res.reportValue
            this.changeDetectorRef.detectChanges()
        }, (err: any) => {
            this.loading = false
            alert('Cannot load data from server.')
        })
    }

    previous() {
        this.pageActive -= 1
        this.pages = this.pagination(this.pageActive,this.pageCount)
        this.setDatetime(this.pageActive)
    }

    next() {
        this.pageActive += 1
        this.pages = this.pagination(this.pageActive,this.pageCount)
        this.setDatetime(this.pageActive)
    }

    pagination(c, m) {
        let dep : number =  (document.body.clientWidth > 520) ? 2 : 1
        var current = c,
            last = m,
            delta = dep,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;
    
        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }
    
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
    
        return rangeWithDots;
    }
    
    setActive(pageNum){
        if(pageNum != "..." && pageNum != this.pageActive){
            this.pages = this.pagination(pageNum,this.pageCount)
            this.pageActive = pageNum
            this.setDatetime(this.pageActive)
        }
    }
}
