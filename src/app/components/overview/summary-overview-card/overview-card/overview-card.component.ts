import { Component, OnInit,Input } from '@angular/core';
import { FvTimeService } from '../../../../services/fv-time.service';

@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.css']
})
export class OverviewCardComponent implements OnInit {

  @Input() lastSeen;
  @Input() speed;
  @Input() vesselName;
  @Input() vesselDesc;
  @Input() distance;
  @Input() lat;
  @Input() long;
  @Input() fuelCons;
  @Input() id;
  @Input() image;
  @Input() prefix;
  constructor(public fvTimeService : FvTimeService) { }

  ngOnInit() {
  }

}
