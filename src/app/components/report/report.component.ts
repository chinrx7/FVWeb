import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { HttpClientService } from '../../services/http-client.service';
import { Store } from '@ngrx/store';
import { FvState } from '../../state-managements/states/app.states';
import * as fvInfoReducer from '../../state-managements/reducers/fv-info.reducer';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

    constructor(private datePipe: DatePipe, 
        private http: HttpClientService,
        private store: Store<FvState>) { }
    pdf: any
    loading: boolean = false
    reportName: string
    fvName: string

    ngOnInit() {

        this.store.select(fvInfoReducer.getFvInfosActive).retry(2).subscribe((res: any) => {
            if(res)
            this.fvName = res.fvInfo.name
        })
        
    }

    selectedReport(event: any) {
        this.loading = true
        let date = this.datePipe.transform(event.timestamp, "yyyy-MM-dd 00:00:00")
        this.http.getReport(event.report.value, date, this.fvName).subscribe((res: any) => {
            this.pdf = null
            this.pdf = window.URL.createObjectURL(res);
            if (this.pdf) {
                this.reportName = `${event.report.name} ${event.timestamp}`
            }
            this.loading = false
        }, (err: any) => {
            this.loading = false
            alert('Report not found.')
        })
    }

    download() {
        var link = document.createElement('a');
        link.href = this.pdf
        link.download = this.reportName
        link.click();
    }
}
