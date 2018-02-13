import { trigger, state, transition, style, animate, keyframes } from '@angular/animations';

export const itemAnim = trigger('item', [
    state('in', style({ transform: 'scale(1)', 'box-shadow': 'none' })),
    state('out', style({ transform: 'scale(1.1)', 'box-shadow': '3px 3px 5px 6px #feeeed' })),

    transition('out => hover', animate('100ms ease-in')),
    transition('hover => out', animate('100ms ease-out'))
])