import { trigger, stagger, state, transition, style, animate, keyframes, group, query, animateChild } from '@angular/animations';

export const listAnimation = trigger('listAnim', [
    // optional等于true，是不存在就不执行。 因为没规定元素..query常有的事。有必要; 否则没有元素时报错
    // stagger， 多个元素一个个进场动画。比如生成2个元素。那么stagger会让第二个元素生成比第一个慢，不至于同时。
    // query搜索子节点元素，规定动画。 也可以查询div，stagger，作为间隔，多个登场

    transition('* => *', [
        query(':enter', style({ opacity: 0 }) , {optional: true}),
        query(':enter', stagger(300, [
            animate('1s', style({ opacity: 1 }))
        ]) , {optional: true}),
        query(':leave', style({ opacity: 1 }), {optional: true}),
        query(':leave', stagger(300, [
            animate('1s', style({ opacity: 0}))
        ]), {optional: true }),
    ]),
    transition(':enter, :leave', [
        query('@*', animateChild())
      ])
]);
