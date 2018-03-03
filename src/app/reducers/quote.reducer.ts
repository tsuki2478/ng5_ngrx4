import { ActionTypes } from './../actions/quote.action';
import { Quote } from './../domain/quote.model';
// import * as quoteAction from '../actions/quote.action';
import * as actions from '../actions/quote.action';

export interface State {
    quote: Quote;
}
export const initialState: State = {
    quote: {
        cn: '来自二次元的乙女... ',
        en: '呐!  我到底要用怎么样的速度生活才能与你再次相遇...',
        pic: '/assets/covers/44.jpg'
    }
};
// action: { type: string; payload: any }
export function reducer(state = initialState, action: actions.Actions): State {
    switch (action.type) {
        // 只有成功和失败返回.. quoteAction.QUOTE_SUCCESS
        case actions.ActionTypes.LOAD_SUCCESS: {
            return {
                // 展开，也就是返回新的状态。 不是基于原有对象
                //  Object.assign({}, state, {quote: action.payload}) ：浅拷贝、对象属性的合并
                ...state, quote: <Quote>action.payload
            };
        }
        case actions.ActionTypes.LOAD_FAIL:
        default: {
            return state;
        }
    }
}
export const getQuote = (state: State) => state.quote;