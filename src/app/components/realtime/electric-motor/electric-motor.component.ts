import { Component, OnInit,Input } from '@angular/core';
import { TooltipFormatService } from '../../../services/tooltip-format.service';
@Component({
  selector: 'app-electric-motor',
  templateUrl: './electric-motor.component.html',
  styleUrls: ['./electric-motor.component.css']
})
export class ElectricMotorComponent implements OnInit {
   
    @Input() speed
    
  constructor(public tooltipFormatService : TooltipFormatService) { }

  ngOnInit() {
  }

}
