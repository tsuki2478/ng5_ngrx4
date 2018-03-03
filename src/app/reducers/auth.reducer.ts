import { Auth } from '../domain/auth.model';
import * as actions from '../actions/auth.action';


export const initialState: Auth = {
// 初始值是空
};

export function reducer(state = initialState, action: actions.Actions): Auth {
    switch (action.type) {
        case actions.ActionTypes.REGISTER_SUCCESS:
        case actions.ActionTypes.LOGIN_SUCCESS: {
            return {
                // 强转类型
                ...<Auth>action.payload
            };
        }
        case actions.ActionTypes.REGISTER_FAIL:
        case actions.ActionTypes.LOGIN_FAIL: {
                return   initialState;
        }
        default: {
            return state;
        }
    }
}