import { AuthService } from './../services/auth.service';
import { getQuote } from './../reducers/index';
// ng-service
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as  actions from '../actions/auth.action';
import { of } from 'rxjs/observable/of';
import { User } from '../domain';

import { Router } from '@angular/router';
import * as routerActions from '../actions/router.action';

@Injectable()
export class AuthEffects {
    //  effect是个流，是action流
    // ofType是Actions流的一个操作符..也是Observable
    // 筛选actions.ActionTypes.LOAD

    // 首先监听actions$,然后捕获到LOAD， 调用this.service$.getQuote()。成功的时候继续发> new actions.LoadSuccessAction(q)。失败则catch
    // 不是对reducers的操作，是对外部的操作..成功或失败会返回新的actions。或影响reducers。
    @Effect()
    login$: Observable<Action> = this.action$
        .ofType<actions.LoginAction>(actions.ActionTypes.LOGIN)
        .map((action: actions.LoginAction) => action.payload)
        .switchMap((val: { email: string, password: string }) => this.service$
            .login(val.email, val.password)
            .map(auth => new actions.LoginSuccessAction(auth))
            .catch(err => Observable.of(new actions.LoginFailAction(JSON.stringify(err))))
        );

    @Effect()
    register$: Observable<Action> = this.action$
        .ofType<actions.LoginAction>(actions.ActionTypes.REGISTER)
        .map((action: actions.LoginAction) => action.payload)
        .switchMap((user: User) => this.service$
            .register(user)
            .map(auth => new actions.RegisterSuccessAction(auth))
            .catch(err => Observable.of(new actions.RegisterFailAction(JSON.stringify(err))))
        );

    @Effect()
    logout$: Observable<Action> = this.action$
        .ofType<actions.LogoutAction>(actions.ActionTypes.LOGOUT)
        //   起导航作用
        .map(() => new routerActions.Go({ path: ['/'] }));

    // 上面的流执行，这里能监听到。 属于流的拼接...
    @Effect()
    loginAndNavigate$: Observable<Action> = this.action$
        .ofType<actions.LoginSuccessAction>(actions.ActionTypes.LOGIN_SUCCESS)
        .map(() => new routerActions.Go({ path: ['/project'] }));

    // 上面的流执行，这里能监听到。 属于流的拼接...
    @Effect()
    registerAndNavigate$: Observable<Action> = this.action$
        .ofType<actions.RegisterSuccessAction>(actions.ActionTypes.REGISTER_SUCCESS)
        .map(() => new routerActions.Go({ path: ['/project'] }));

    // 判断跳转
        @Effect({ dispatch: false })
        navigate$ = this.action$.ofType(routerActions.GO)
          .map((action: routerActions.Go) => action.payload)
          .do(({ path, query: queryParams, extras}) =>
            this.router.navigate(path, { queryParams, ...extras }));

    /**
    *
    * @param actions$
    * @param quoteService
    */
    constructor(private action$: Actions,private router: Router, private service$: AuthService) { }
}