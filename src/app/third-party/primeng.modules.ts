import { NgModule } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';


@NgModule({
    imports: [
        DialogModule,
        CalendarModule
    ],
    exports:[
        DialogModule,
        CalendarModule
    ]
  })
  export class PrimeNGModules {}