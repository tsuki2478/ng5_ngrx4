import { User } from './../domain/user.model';
import { Auth } from './../domain/auth.model';
import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import { Project } from '../domain';


export const ActionTypes = {
    // 前面中括号表示哪个reduser    load是action信息。  作为Key
    ADD: type('[Project] Add'),
    ADD_SUCCESS: type('[Project] Add Success'),
    ADD_FAIL: type('[Project] Add Fail'),

    UPDATE: type('[Project] Update'),
    UPDATE_SUCCESS: type('[Project] Update Success'),
    UPDATE_FAIL: type('[Project] Update Fail'),

    DELETE: type('[Project] Delete'),
    DELETE_SUCCESS: type('[Project] Delete Success'),
    DELETE_FAIL: type('[Project] Delete Fail'),

    LOAD: type('[Project] Load'),
    LOAD_SUCCESS: type('[Project] Load Success'),
    LOAD_FAIL: type('[Project] Load Fail'),

    SELECT_PROJECT: type('[Project] Select Project'),

    INVITE: type('[Project] Invite'),
    INVITE_SUCCESS: type('[Project] Invite Success'),
    INVITE_FAIL: type('[Project] Invite Fail'),

};

// 增加
export class AddAction implements Action {
    readonly type = ActionTypes.ADD;
    // 携带的参数
    constructor(public payload: Project) { }
}

export class AddSuccessAction implements Action {
    type = ActionTypes.ADD_SUCCESS;
    constructor(public payload: Project) { }
}

export class AddFailAction implements Action {
    type = ActionTypes.ADD_FAIL;
    constructor(public payload: string) { }
}


// 更新
export class UpdateAction implements Action {
    type = ActionTypes.UPDATE;
    // 携带的参数
    constructor(public payload: Project) { }
}

export class UpdateSuccessAction implements Action {
    type = ActionTypes.UPDATE_SUCCESS;
    constructor(public payload: Project) { }
}

export class UpdateFailAction implements Action {
    type = ActionTypes.UPDATE_FAIL;
    constructor(public payload: string) { }
}

// 删除
export class DeleteAction implements Action {
    type = ActionTypes.DELETE;
    // 携带的参数
    constructor(public payload: Project) { }
}

export class DeleteSuccessAction implements Action {
    type = ActionTypes.DELETE_SUCCESS;
    constructor(public payload: any) { }
}

export class DeleteFailAction implements Action {
    type = ActionTypes.DELETE_FAIL;
    constructor(public payload: string) { }
}

// 查询
export class LoadAction implements Action {
    type = ActionTypes.LOAD;
    // 携带的参数
    constructor(public payload: any) { }
}

export class LoadSuccessAction implements Action {
    type = ActionTypes.LOAD_SUCCESS;
    constructor(public payload: Project[]) { }
}

export class LoadFailAction implements Action {
    type = ActionTypes.LOAD_FAIL;
    constructor(public payload: string) { }
}

export class SelectAction implements Action {
    type = ActionTypes.SELECT_PROJECT;
    constructor(public payload: Project) {
    }
}

// 邀请组员
export class InviteAction implements Action {
    type = ActionTypes.INVITE;
    // 携带的参数
    constructor(public payload: { projectId: string; members: User[] }) {
    }
}

export class InviteSuccessAction implements Action {
    type = ActionTypes.INVITE_SUCCESS;
    constructor(public payload: Project) { }
}

export class InviteFailAction implements Action {
    type = ActionTypes.INVITE_FAIL;
    constructor(public payload: string) { }
}


// 串联起来
export type Actions
    = AddAction
    | AddSuccessAction
    | AddFailAction
    | UpdateAction
    | UpdateSuccessAction
    | UpdateFailAction
    | UpdateAction
    | UpdateSuccessAction
    | UpdateFailAction
    | DeleteAction
    | DeleteSuccessAction
    | DeleteFailAction
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | SelectAction
    |InviteAction
    |InviteSuccessAction
    |InviteFailAction;
