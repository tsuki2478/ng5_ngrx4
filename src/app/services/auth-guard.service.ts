import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as routerActions from '../actions/router.action';

@Injectable()
export class AuthGuardService implements CanActivate {
    /**
  * 构造函数用于注入服务的依赖以及进行必要的初始化
  *
  * @param router 路由注入，用于导航处理
  * @param store$ redux store注入，用于状态管理
  */
    constructor(private store$: Store<fromRoot.State>) { }


    /**
     * 用于判断是否可以激活该路由
     *
     * @param route
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.checkAuth();
    }

    checkAuth(): Observable<boolean> {
        return this.store$
          .select(s => s.auth)
          .map(auth => {
            const result = auth.token !== undefined && auth.token !== null;
            if (!result) {
              this.store$.dispatch(new routerActions.Go({path: ['/login']}));
            }
            return result;
          })
        //   可能没有值，给个初始值
          .defaultIfEmpty(false);
      }
}
