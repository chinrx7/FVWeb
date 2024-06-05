import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule,Highcharts,HIGHCHARTS_MODULES  }   from 'angular-highcharts';
import exporting from 'highcharts/modules/exporting.src';

@NgModule({
    imports: [
        CommonModule,
        ChartModule
    ],
    exports:[
        CommonModule,
        ChartModule
    ],
    providers:[
        { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
    ]
  })
  export class HighchartModules {
    constructor(){
        Highcharts.setOptions({
            global:{
                useUTC :false
            }
        })
    }
  }

  export function highchartsModules() {
    return [ exporting ];
  }