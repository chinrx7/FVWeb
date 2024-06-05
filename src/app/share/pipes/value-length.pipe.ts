import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
    name: 'valueLength'
})

export class ValueLengthPipe implements PipeTransform {
  
    constructor(private decimalPipe:DecimalPipe){

    }
    transform(value: any, round:number = 2): any {

        if(!value) {
            return "---"
        }
        else{
           return this.decimalPipe.transform(value,`0.0-${round}`)
        }
    }
}