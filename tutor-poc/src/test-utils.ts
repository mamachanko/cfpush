import {Store} from 'redux';
import * as deepmerge from 'deepmerge';
import {Action} from './actions'; // eslint-disable-line import/named
import {State, initialState} from './reducer';

export const createStoreMock = (partialState: any = {}): Store<State, Action> => ({
	dispatch: jest.fn(),
	getState: (): State => deepmerge(initialState, partialState),
	subscribe: jest.fn(),
	replaceReducer: jest.fn()
});

export const sleep = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 0));

export const SPACE = ' ';
export const CTRL_C = '\u0003';
