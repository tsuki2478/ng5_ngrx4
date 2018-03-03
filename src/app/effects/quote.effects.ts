import { getQuote } from './../reducers/index';
// ng-service
import { QuoteService } from './../services/quote.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as  actions from '../actions/quote.action';
import { of } from 'rxjs/observable/of';

@Injectable()
export class QuoteEffects {
    //  effect是个流，是action流
    // ofType是Actions流的一个操作符..也是Observable
    // 筛选actions.ActionTypes.LOAD

    // 首先监听actions$,然后捕获到LOAD， 调用this.service$.getQuote()。成功的时候继续发> new actions.LoadSuccessAction(q)。失败则catch
    // 不是对reducers的操作，是对外部的操作..成功或失败会返回新的actions。或影响reducers。
    @Effect()
    quote$: Observable<Action> = this.action$
        .ofType<actions.LoadAction>(actions.ActionTypes.LOAD)
        .switchMap(
            () => this.service$.getQuote()
            .map(q => new actions.LoadSuccessAction(q))
            .catch(err => Observable.of(new actions.LoadFailAction(JSON.stringify(err))))
        );

    /**
        *
        * @param actions$
        * @param quoteService
        */
    constructor(private action$: Actions, private service$: QuoteService) { }
}