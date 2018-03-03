import { Auth } from './../domain/auth.model';
import { environment } from './../../environments/environment';
import { NgModule } from '@angular/core';
import { StoreModule, combineReducers, ActionReducer, createFeatureSelector } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { compose } from '@ngrx/core/compose';
// import { RouterStoreModule } from '@ngrx/router-store';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { createSelector } from 'reselect';

import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';
import * as fromProject from './project.reducer';
import * as fromTaskList from './task-list.reducer';


/**
 * 正如我们的 reducer 像数据库中的表一样，我们的顶层 state 也包含各个子 reducer 的 state
 * 并且使用一个 key 来标识各个子 state
 */
// 全局state 。。包含
export interface State {
    quote: fromQuote.State;
    auth: Auth;
    projects: fromProject.State;
    taskLists: fromTaskList.State;
}
// 全局初始值
const initialState: State = {
    quote: fromQuote.initialState,
    auth: fromAuth.initialState,
    projects: fromProject.initialState,
    taskLists: fromTaskList.initialState,
};
// 新字典 ，
const reducers = {
    // 放进去
    quote: fromQuote.reducer,
    auth: fromAuth.reducer,
    projects: fromProject.reducer,
    taskLists: fromTaskList.reducer,
};
// 下面是2个环境。生产和开发
// 合并 ActionReducer<State>返回state
// state是不可改变的。 只会生成新的。
const productionReducers: ActionReducer<State> = combineReducers(reducers);
// 做一个保护  可以这样写combineReducers(storeFreeze(reducer));
const developmentReducers: ActionReducer<State> = combineReducers(reducers);
// compose(storeFreeze, combineReducers)(reducers);
export function reducer(state = initialState, action: any): State {
    // environment.production判断外界环境
    return environment.production ? productionReducers(state, action) : developmentReducers(state, action);
}


// 搭配quote里的export const getQuote = (state: State) => state.quote;
// 简单来说就是 查询。也就是类似sql效果
export const getQuoteState = (state: State) => state.quote;
export const getAuthState = (state: State) => state.auth;
export const getProjectState = (state: State) => state.projects;
export const getTaskListState = (state: State) => state.taskLists;


// 任意两个函数组合一起，然后组成一个有记忆性的组合函数
export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);
export const getProjects = createSelector(getProjectState, fromProject.getAll);
export const getTaskList = createSelector(getTaskListState, fromTaskList.getSelected);

// export const getAuthState = createFeatureSelector<Auth>('auth');

@NgModule({
    imports: [
        // StoreModule.provideStore(reducer),
        StoreModule.forRoot(reducers),
        // RouterStoreModule.connectRouter(),
        // StoreDevtoolsModule.instrumentOnlyWithExtension(),
        StoreRouterConnectingModule,
        // DevTool 需要在 StoreModule 之后导入
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : []
    ],
})
export class AppStoreModule { }