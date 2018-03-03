// ng-service
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ProjectService } from './../services/project.service';
import { Action, Store } from '@ngrx/store';
import { Project, User } from '../domain';
import { Router } from '@angular/router';
import * as actions from '../actions/project.action';
import * as fromRoot from '../reducers';
import * as routerActions from '../actions/router.action';
import * as listActions from '../actions/task-list.action';
import { InviteAction } from './../actions/project.action';

@Injectable()
export class ProjectEffects {

    @Effect()
    loadProjects$: Observable<Action> = this.actions$
        .ofType<actions.LoadAction>(actions.ActionTypes.LOAD)
        .map(action => action.payload)
        .withLatestFrom(this.store$.select(fromRoot.getAuthState))
        .switchMap(([_, auth]) => this.service
            .get(auth.userId)
            .map(projects => new actions.LoadSuccessAction(projects))
            .catch(err => of(new actions.LoadFailAction(JSON.stringify(err))))
        );

    @Effect()
    addProject$: Observable<Action> = this.actions$
        .ofType<actions.AddAction>(actions.ActionTypes.ADD)
        .map(action => action.payload)
        .withLatestFrom(this.store$.select(fromRoot.getAuthState))
        .switchMap(([project, auth]) => {
            const added = { ...project, members: [`${auth.userId}`] };
            return this.service
                .add(added)
                .map(projects => new actions.AddSuccessAction(projects))
                .catch(err => of(new actions.AddFailAction(JSON.stringify(err))));
        }
        );

    @Effect()
    updateProject$: Observable<Action> = this.actions$
        .ofType<actions.UpdateAction>(actions.ActionTypes.UPDATE)
        .map(action => action.payload)
        .switchMap(project => this.service
            .update(project)
            .map(returned => new actions.UpdateSuccessAction(returned))
            .catch(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
        );


    @Effect()
    delProject$: Observable<Action> = this.actions$
        .ofType<actions.DeleteAction>(actions.ActionTypes.DELETE)
        .map(action => action.payload)
        .switchMap(project => this.service
            .del(project)
            .map(returned => new actions.DeleteSuccessAction(returned))
            .catch(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
        );

    @Effect()
    selectProject$: Observable<Action> = this.actions$
        .ofType<actions.SelectAction>(actions.ActionTypes.SELECT_PROJECT)
        .map(action => action.payload)
        .map(project => new routerActions.Go({ path: [`/tasklists/${project.id}`] }));

    @Effect()
    loadTaskLists$: Observable<Action> = this.actions$
        .ofType<actions.SelectAction>(actions.ActionTypes.SELECT_PROJECT)
        .map(action => action.payload)
        .map(project => new listActions.LoadAction(project.id));

    @Effect()
    invite$: Observable<Action> = this.actions$
        .ofType<actions.InviteAction>(actions.ActionTypes.INVITE)
        .map(action => action.payload)
        .switchMap(({ projectId, members }) =>
            this.service.Invite(projectId, members)
                .map((project: Project) => new actions.InviteSuccessAction(project))
                .catch(err => of(new actions.InviteFailAction(err)))
        );



    @Effect({ dispatch: false })
    navigate$ = this.actions$.ofType(routerActions.GO)
        .map((action: routerActions.Go) => action.payload)
        .do(({ path, query: queryParams, extras }) =>
            this.router.navigate(path, { queryParams, ...extras }));

    /**
     *
     * @param actions$ action 流
     * @param service  注入 ProjectService
     * @param store$ 注入 redux store
     */
    constructor(private actions$: Actions,
        private service: ProjectService,
        private router: Router,
        private store$: Store<fromRoot.State>) { }
}
