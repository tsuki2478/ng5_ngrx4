import { User } from './../domain/user.model';
import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';
import {Project, TaskList} from '../domain';


export const ActionTypes = {
    // 前面中括号表示哪个reduser    load是action信息。  作为Key
    ADD: type('[TaskList] Add'),
    ADD_SUCCESS: type('[TaskList] Add Success'),
    ADD_FAIL: type('[TaskList] Add Fail'),

    UPDATE: type('[TaskList] Update'),
    UPDATE_SUCCESS: type('[TaskList] Update Success'),
    UPDATE_FAIL: type('[TaskList] Update Fail'),

    DELETE: type('[TaskList] Delete'),
    DELETE_SUCCESS: type('[TaskList] Delete Success'),
    DELETE_FAIL: type('[TaskList] Delete Fail'),

    LOAD: type('[TaskList] Load'),
    LOAD_SUCCESS: type('[TaskList] Load Success'),
    LOAD_FAIL: type('[TaskList] Load Fail'),

    SWAP: type('[TaskList] Swap'),
    SWAP_SUCCESS: type('[TaskList] Swap Success'),
    SWAP_FAIL: type('[TaskList] Swap Fail'),

};

// 增加
export class AddAction implements Action {
    readonly type = ActionTypes.ADD;
    // 携带的参数
    constructor(public payload: TaskList) { }
}

export class AddSuccessAction implements Action {
    type = ActionTypes.ADD_SUCCESS;
    constructor(public payload: TaskList) { }
}

export class AddFailAction implements Action {
    type = ActionTypes.ADD_FAIL;
    constructor(public payload: string) { }
}


// 更新
export class UpdateAction implements Action {
    type = ActionTypes.UPDATE;
    // 携带的参数
    constructor(public payload: TaskList) { }
}

export class UpdateSuccessAction implements Action {
    type = ActionTypes.UPDATE_SUCCESS;
    constructor(public payload: TaskList) { }
}

export class UpdateFailAction implements Action {
    type = ActionTypes.UPDATE_FAIL;
    constructor(public payload: string) { }
}

// 删除
export class DeleteAction implements Action {
    type = ActionTypes.DELETE;
    // 携带的参数
    constructor(public payload: TaskList) { }
}

export class DeleteSuccessAction implements Action {
    type = ActionTypes.DELETE_SUCCESS;
    constructor(public payload: TaskList) { }
}

export class DeleteFailAction implements Action {
    type = ActionTypes.DELETE_FAIL;
    constructor(public payload: string) { }
}

// 查询
export class LoadAction implements Action {
    type = ActionTypes.LOAD;
    // 携带的参数
    constructor(public payload: string) { }
}

export class LoadSuccessAction implements Action {
    type = ActionTypes.LOAD_SUCCESS;
    constructor(public payload: TaskList[]) { }
}

export class LoadFailAction implements Action {
    type = ActionTypes.LOAD_FAIL;
    constructor(public payload: string) { }
}


export class SwapAction implements Action {
    type = ActionTypes.SWAP;
    constructor(public payload: { src: TaskList; target: TaskList }) {
    }
}

export class SwapSuccessAction implements Action {
    type = ActionTypes.SWAP_SUCCESS;
    constructor(public payload: TaskList[]) { }
}

export class SwapFailAction implements Action {
    type = ActionTypes.SWAP_FAIL;
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
    | SwapAction
    | SwapSuccessAction
    | SwapFailAction;
