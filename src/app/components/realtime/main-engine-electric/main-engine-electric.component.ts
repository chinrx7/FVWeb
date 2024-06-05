import { Component, OnInit,Input } from '@angular/core';
import { TooltipFormatService } from '../../../services/tooltip-format.service';
@Component({
  selector: 'app-main-engine-electric',
  templateUrl: './main-engine-electric.component.html',
  styleUrls: ['./main-engine-electric.component.css']
})
export class MainEngineElectricComponent implements OnInit {
    @Input() flow_supply
    @Input() temp_supply
    @Input() dens_supply
    @Input() flow_return
    @Input() temp_return
    @Input() dens_return
    @Input() cons
    @Input() consL
    @Input() speed_eng
    @Input() speed_gear

  constructor(public tooltipFormatService : TooltipFormatService) { }

  ngOnInit() {
  }

}
