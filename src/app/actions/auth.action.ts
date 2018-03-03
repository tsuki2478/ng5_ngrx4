import { User } from './../domain/user.model';
import { Auth } from './../domain/auth.model';
import { Action } from '@ngrx/store';
import { type } from '../utils/type.util';


export const ActionTypes = {
    // 前面中括号表示哪个reduser    load是action信息。  作为Key
    LOGIN: type('[Auth] Login'),
    LOGIN_SUCCESS: type('[Auth] Login Success'),
    LOGIN_FAIL: type('[Auth] Login Fail'),

    REGISTER: type('[Auth] Register'),
    REGISTER_SUCCESS: type('[Auth] Register Success'),
    REGISTER_FAIL: type('[Auth] Register Fail'),

    LOGOUT: type('[Auth] Logout'),
};

export class LoginAction implements Action {
    readonly type = ActionTypes.LOGIN;
    // 携带的参数
    constructor(public payload: { email: string; password: string }) { }
}

export class LoginSuccessAction implements Action {
    type = ActionTypes.LOGIN_SUCCESS;
    constructor(public payload: Auth) { }
}

export class LoginFailAction implements Action {
    type = ActionTypes.LOGIN_FAIL;
    constructor(public payload: string) { }
}



export class RegisterAction implements Action {
    type = ActionTypes.REGISTER;
    // 携带的参数
    constructor(public payload: User) { }
}

export class RegisterSuccessAction implements Action {
    type = ActionTypes.REGISTER_SUCCESS;
    constructor(public payload: Auth) { }
}

export class RegisterFailAction implements Action {
    type = ActionTypes.REGISTER_FAIL;
    constructor(public payload: string) { }
}

export class LogoutAction implements Action {
    type = ActionTypes.LOGOUT;
    constructor(public payload: null) { }
}

// 串联起来
export type Actions
    = LoginAction
    | LoginSuccessAction
    | LoginFailAction
    | RegisterAction
    | RegisterSuccessAction
    | RegisterFailAction
    | LogoutAction;
