import {Middleware as ReduxMiddleware, Dispatch as ReduxDispatch, Action} from 'redux';
import {State} from './state'; // eslint-disable-line import/named

export type Middleware = ReduxMiddleware<{}, State, ReduxDispatch<Action>>;
export type Middlewares = Middleware[];
