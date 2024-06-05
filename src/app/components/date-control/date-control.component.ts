import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
declare var $: any
@Component({
    selector: 'app-date-control',
    templateUrl: './date-control.component.html',
    styleUrls: ['./date-control.component.css']
})
export class DateControlComponent implements OnInit {
    @Output() selectedReport = new EventEmitter();
    @Input() loading: boolean = false
    report: any = {
        name: 'Daily Report',
        value: 'd'
    }
    dateTime: Date
    constructor(private datePipe: DatePipe) { }

    ngOnInit() {
        $(document).on('click', '.control-report .dropdown-menu', function (e) {
            e.stopPropagation();
        });

        let now = new Date()
        this.setCalendar(now)
    }

    setCalendar(dateTime: Date) {

        if (this.report.value == 'd')
            this.dateTime = new Date(this.datePipe.transform(dateTime.setDate(dateTime.getDate() - 1), 'yyyy-MM-dd 00:00'))
        else if (this.report.value == 'm')
            this.dateTime = new Date(this.datePipe.transform(dateTime.setDate(dateTime.getDate() - 1), 'yyyy-MM'))
    }

    selectReport(value: string, name: string) {
        this.report.name = name
        this.report.value = value
        let now = new Date()
        this.setCalendar(now)
    }

    loadReport() {

        let body = {
            report: this.report,
            timestamp: this.dateTime
        }
        this.selectedReport.emit(body)
    }

    get formatDatetime(): string {
        if (this.report.value == 'd')
            return "dd-M-yy"
        else return "M-yy"
    }
}
