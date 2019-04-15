import * as deepmerge from 'deepmerge';
import {Store} from 'redux';
import {Action} from './actions'; // eslint-disable-line import/named
import {initialState} from './reducer';
import {State} from './state';

export const createStoreMock = (partialState: any = {}): Store<State, Action> => ({
	dispatch: jest.fn(),
	getState: (): State => deepmerge(initialState, partialState),
	subscribe: jest.fn(),
	replaceReducer: jest.fn()
});

export const sleep = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 0));

export const SPACE = ' ';
export const CTRL_C = '\u0003';
