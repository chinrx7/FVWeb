import { Component, OnInit,Input } from '@angular/core';
import { FvTimeService } from '../../../services/fv-time.service';
import { CoordinatesService } from '../../../services/coordinate.service';

@Component({
  selector: 'app-summary-overview-card',
  templateUrl: './summary-overview-card.component.html',
  styleUrls: ['./summary-overview-card.component.css']
})
export class SummaryOverviewCardComponent implements OnInit {

  @Input() data : any[] = []
  constructor(private fvTimeService : FvTimeService,
    private coordinatesService : CoordinatesService) { }

  ngOnInit() {
  }

}
