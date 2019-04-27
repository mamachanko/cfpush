import * as deepmerge from 'deepmerge';
import {Store} from 'redux';
import {DeepPartial} from 'ts-essentials';
import {Action} from './actions';
import {State, UNSTARTED} from './state';

const initialState: State = {
	app: {
		waitForTrigger: true,
		pinOutput: false,
		exit: false
	},
	cloudFoundryContext: {},
	pages: {
		completed: [],
		current: {
			body: '',
			command: {
				filename: 'date',
				args: [],
				status: UNSTARTED,
				stdout: []
			}
		},
		next: [{
			body: '',
			command: {filename: 'date', args: []}
		}]
	}
};

export const createStoreMock = (partialState: DeepPartial<State> = {}): Store<State, Action> => ({
	dispatch: jest.fn(),
	getState: (): State => deepmerge(initialState, partialState),
	subscribe: jest.fn(),
	replaceReducer: jest.fn()
});

export const sleep = (ms?: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms || 0));

export const SPACE = ' ';
export const CTRL_C = '\u0003';
