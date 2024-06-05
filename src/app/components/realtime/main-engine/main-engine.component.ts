import { Component, OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';
import { TooltipFormatService } from '../../../services/tooltip-format.service';
@Component({
  selector: 'app-main-engine',
  templateUrl: './main-engine.component.html',
  styleUrls: ['./main-engine.component.css']
})
export class MainEngineComponent implements OnInit, OnChanges {
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
    @Input() load?: any;
    hasLoad: boolean = false;

  constructor(public tooltipFormatService : TooltipFormatService) { }

  ngOnInit() {
    //console.log(this.load)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.load && this.load.value){
      this.hasLoad = true;
    } else {
      this.hasLoad = false;
    }
    //console.log(this.hasLoad)
  }
}
