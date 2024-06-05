import { Component, OnInit,Input } from '@angular/core';
import { FvTimeService } from '../../../services/fv-time.service';
import { CoordinatesService } from '../../../services/coordinate.service';
import { Animations } from './summary-overview.animations';

@Component({
    selector: 'app-summary-overview',
    templateUrl: './summary-overview.component.html',
    styleUrls: ['./summary-overview.component.css'],
    animations:[
        // Animations.listAnimation
    ]
})
export class SummaryOverviewComponent implements OnInit {
    constructor(private fvTimeService : FvTimeService,
        private coordinatesService : CoordinatesService) { }

    ngOnInit() { }

    @Input() data : any[] =[];
    @Input() blankData : any[] =[];
}