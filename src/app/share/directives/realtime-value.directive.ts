import { Directive, Input, ElementRef, transition } from '@angular/core';

@Directive({ selector: '[dashValue]' })
export class RealTimeValueDirective {

    constructor(private el: ElementRef) {

    }

    _value: any;
    get value(): any {
        return this._value;
    }

    @Input('dashValue')
    set value(value: any) {
        this._value = value;
        if (!this._value || !this._value.hasOwnProperty('value') || !this._value.value) {
            this.el.nativeElement.style.color = 'red';
        }
        else {
            if(value.cal)
                this.el.nativeElement.style.color = "cornflowerblue"
            else
                this.el.nativeElement.style.color = this.getDiffTime(this._value.timestamp)
        }
    }

    getDiffTime(time: string): string {

        let _time = new Date(time).getTime()
        let now = new Date().getTime()
        let diffHour = (now-_time) / 1000 / 60 / 60
        if(diffHour > 5)
            return "tomato"
        else if(diffHour > 1)
            return "orange"
        return "cornflowerblue"
    }
}