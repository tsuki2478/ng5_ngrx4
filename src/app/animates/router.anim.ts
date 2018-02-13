import { trigger, state, transition, style, animate, keyframes, group } from '@angular/animations';

export const slideToRight = trigger('routeAnim', [
    state('void', style({ 'position': 'initial', 'width': '100%',   })),
    state('*', style({ 'position': 'initial', 'width': '100%',   })),
    // height：100%，会沾满。 fixed是布局问题。
    // 'void => *' 改成'：enter ' 进
    // group 是执行多个过渡效果。 opacity是淡入淡出
    transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        group([
            animate('.5s ease-in-out', style({ transform: 'translateX(0)' })),
            animate('.3s ease-in', style({ opacity: 1 })),
        ])
    ]),
//   * => void改成 ：leave    也行。
    transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        group([
            animate('.5s ease-in-out', style({ transform: 'translateX(100%)' })),
            animate('.3s ease-in', style({ opacity: 0 })),
        ])
    ]),
])