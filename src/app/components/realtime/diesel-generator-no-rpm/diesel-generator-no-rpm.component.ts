import { Component, OnInit,Input } from '@angular/core';
import { TooltipFormatService } from '../../../services/tooltip-format.service';
@Component({
  selector: 'app-diesel-generator-no-rpm',
  templateUrl: './diesel-generator-no-rpm.component.html',
  styleUrls: ['./diesel-generator-no-rpm.component.css']
})
export class DieselGeneratorNoRpmComponent implements OnInit {
    @Input() flow_supply
    @Input() temp_supply
    @Input() dens_supply
    @Input() flow_return
    @Input() temp_return
    @Input() dens_return
    @Input() cons
    @Input() consL
    
  constructor(public tooltipFormatService : TooltipFormatService) { }

  ngOnInit() {
  }

}
