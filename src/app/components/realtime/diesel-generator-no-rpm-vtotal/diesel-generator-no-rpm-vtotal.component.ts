import { Component, OnInit,Input } from '@angular/core';
import { TooltipFormatService } from '../../../services/tooltip-format.service';
@Component({
  selector: 'app-diesel-generator-no-rpm-vtotal',
  templateUrl: './diesel-generator-no-rpm-vtotal.component.html',
  styleUrls: ['./diesel-generator-no-rpm-vtotal.component.css']
})
export class DieselGeneratorNoRpmVtotalComponent implements OnInit {
    @Input() flow_supply
    @Input() flow_return
    @Input() cons
    @Input() consL
    
  constructor(public tooltipFormatService : TooltipFormatService) { }

  ngOnInit() {
  }

}
