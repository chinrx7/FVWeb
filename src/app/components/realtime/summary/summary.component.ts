import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TooltipFormatService } from '../../../services/tooltip-format.service';
import { CoordinatesService } from '../../../services/coordinate.service';
@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {


    @Input() speedCurr: any
    @Input() lat
    @Input() long
    @Input() heading
    @Input() distance
    @Input() fuel_cons

    @Input() speedAvg
    @Input() speedMax
    @Input() fuelAvg
    @Input() fuelTotal


    constructor(private datePipe: DatePipe, 
        public tooltipFormatService: TooltipFormatService,
        public coordinatesService : CoordinatesService) { }

    ngOnInit() {
    }

    // getHour(timestamp)
    // {
    //     // console.log('this.fuelTotal');
    //     // console.log(this.fuelTotal);
    //     if(timestamp)
    //     {
    //         let dt = new Date(timestamp);
    //         let hour = dt.getHours() + dt.getMinutes()/60;
            
    //     return hour;
        
    //     }
    //     else {return 1;}
    // }

    linkToMap() {
        window.open(`https://www.google.com/maps/?q=${this.lat.value},${this.long.value}`, '_blank')
    }
}
