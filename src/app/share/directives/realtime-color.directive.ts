import { Directive, Input, ElementRef, transition } from '@angular/core';

@Directive({ selector: '[dashColor]' })
export class RealTimeColorDirective {

    constructor(private el: ElementRef) {

    }

    _value: string;
    get value(): string {
        return this._value;
    }

    @Input('dashColor')
    set value(value: string) {
        this.el.nativeElement.style.color = this.getDiffTime(value)
    }

    getDiffTime(time: string): string {
        let _time = new Date(time).getTime()
        let now = new Date().getTime()
        let diffHour = (now-_time) / 1000 / 60 / 60
        if(diffHour > 5)
            return "tomato"
        else if(diffHour > 1)
            return "orange"
        return "#05F6E0"
    }
}