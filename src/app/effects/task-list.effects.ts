import { TaskListService } from './../services/task-list.service';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Task } from '../domain';
import * as actions from '../actions/task-list.action';

@Injectable()
export class TaskEffects {

    @Effect()
    loadTasksLists$: Observable<Action> = this.actions$
        .ofType<actions.LoadAction>(actions.ActionTypes.LOAD)
        .map(action => action.payload)
        .switchMap((projectId) =>
            this.service$
                .get(projectId)
                .map(tl => new actions.LoadSuccessAction(tl))
                .catch(err => of(new actions.LoadFailAction(JSON.stringify(err))))
        );

    @Effect()
    addTask$: Observable<Action> = this.actions$
        .ofType<actions.AddAction>(actions.ActionTypes.ADD)
        .map(action => action.payload)
        .switchMap((taskLists) => {
            return this.service$
                .add(taskLists)
                .map(tl => new actions.AddSuccessAction(tl))
                .catch(err => of(new actions.AddFailAction(JSON.stringify(err))));
        }
        );

    @Effect()
    updateTask$: Observable<Action> = this.actions$
        .ofType<actions.UpdateAction>(actions.ActionTypes.UPDATE)
        .map(action => action.payload)
        .switchMap(task => this.service$
            .update(task)
            .map(tl => new actions.UpdateSuccessAction(tl))
            .catch(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
        );

    @Effect()
    delTask$: Observable<Action> = this.actions$
        .ofType<actions.DeleteAction>(actions.ActionTypes.DELETE)
        .map(action => action.payload)
        .switchMap(task => this.service$
            .del(task)
            .map(tl => new actions.DeleteSuccessAction(tl))
            .catch(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
        );

    @Effect()
    swap$: Observable<Action> = this.actions$
        .ofType<actions.SwapAction>(actions.ActionTypes.SWAP)
        .map(action => action.payload)
        .switchMap(({ src, target }) => this.service$
            .swapOrder(src, target)
            .map(taskLists => new actions.SwapSuccessAction(taskLists))
            .catch(err => of(new actions.SwapFailAction(JSON.stringify(err))))
        );

    /**
     * 任务的 Effects
     * @param actions$ 注入 action 数据流
     * @param service$ 注入任务服务
     * @param store$ 注入 redux store
     */
    constructor(private actions$: Actions,
        private service$: TaskListService) { }
}
