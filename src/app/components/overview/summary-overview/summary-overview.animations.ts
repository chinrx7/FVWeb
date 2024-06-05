import {
    trigger,
    state,
    style,
    animate,
    transition,
    query,
    stagger,
    keyframes
} from '@angular/animations';

export const Animations =
    {
        listAnimation:
            trigger('listAnimation', [
                transition('* => *', [
                    query(':enter', style({ opacity: 0 }), { optional: true }),
                    // query(':enter', style({ opacity: 0 })),
                    query(':enter', stagger('100ms', [
                        animate('0.5s ease-in', keyframes([
                            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
                            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
                            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
                        ]))]), { optional: true }),
                    query(':leave', stagger('100ms', [
                        animate('0.5s ease-in', keyframes([
                            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
                            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
                            style({ opacity: 0, transform: 'translateY(-75%)', offset: 1.0 }),
                        ]))]), { optional: true })
                ])
            ])
    }

