// 定义
// export const QUOTE = 'Quote';
// export const QUOTE_SUCCESS = 'Quote Success';
// export const QUOTE_FAIL = 'Quote Fail';

import { Quote } from './../domain/quote.model';
import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';

export const ActionTypes = {
    // 前面中括号表示哪个reduser    load是action信息。  作为Key
    LOAD: type('[Quote] Load'),
    LOAD_SUCCESS: type('[Quote] Load Success'),
    LOAD_FAIL: type('[Quote] Load Fail'),
};

export class LoadAction implements Action {
    type = ActionTypes.LOAD;
    constructor(public payload: null) { }
}

export class LoadSuccessAction implements Action {
    type = ActionTypes.LOAD_SUCCESS;
    constructor(public payload: Quote) { }
}

export class LoadFailAction implements Action {
    type = ActionTypes.LOAD_FAIL;
    constructor(public payload: string) { }
}

// 串联起来
export type Actions
    = LoadAction
    |LoadSuccessAction
    |LoadFailAction;
