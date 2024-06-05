import { Component, OnInit,Input } from '@angular/core';
import { TooltipFormatService } from '../../../services/tooltip-format.service';

@Component({
  selector: 'app-aux-engine',
  templateUrl: './aux-engine.component.html',
  styleUrls: ['./aux-engine.component.css']
})
export class AuxEngineComponent implements OnInit {
    @Input() flow_supply
    @Input() temp_supply
    @Input() dens_supply
    @Input() flow_return
    @Input() temp_return
    @Input() dens_return
    @Input() cons
    @Input() consL
    @Input() speed_eng
    constructor(public tooltipFormatService : TooltipFormatService) { }

  ngOnInit() {
  }

}
