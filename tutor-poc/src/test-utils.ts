import {Store} from 'redux';
import {Action} from './actions'; // eslint-disable-line import/named
import {State, initialState as defaultState} from './reducer';

export const createStoreMock = (state: State = defaultState): Store<State, Action> => ({
	dispatch: jest.fn(),
	getState: (): State => state,
	subscribe: jest.fn(),
	replaceReducer: jest.fn()
});

export const sleep = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 0));

export const SPACE = ' ';
export const CTRL_C = '\u0003';
