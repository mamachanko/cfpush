import {runCommand, started, outputReceived, finished} from './actions';
import {createStoreMock} from './test-utils';
import {createDryMiddleware} from './dry-middleware';
import {UNSTARTED} from './command-status';

describe('Dry Middleware', () => {
	let storeMock;
	let nextMiddlewareMock;
	let sut;

	beforeEach(() => {
		storeMock = createStoreMock({
			pages: {
				current: {
					text: 'Let us pretend run a real command',
					command: 'a real command',
					status: UNSTARTED,
					output: []
				}
			}
		});
		nextMiddlewareMock = jest.fn();
		sut = createDryMiddleware(() => 'test-uid')(storeMock)(nextMiddlewareMock);
	});

	afterEach(jest.resetAllMocks);

	describe('when running a command', () => {
		beforeEach(() => {
			sut(runCommand());
		});

		it('pretends to run the command', () => {
			expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, started());
			expect(storeMock.dispatch).toHaveBeenNthCalledWith(2, outputReceived('pretending to run "a real command"', 'test-uid'));
			expect(storeMock.dispatch).toHaveBeenNthCalledWith(3, finished());
			expect(storeMock.dispatch).toHaveBeenCalledTimes(3);
			expect(nextMiddlewareMock).not.toHaveBeenCalled();
		});
	});
});
