import {runCommand, started, outputReceived, finished} from './actions';
import {createStoreMock} from './test-utils';
import {createDryMiddleware} from './dry-middleware';

describe('Dry Middleware', () => {
	let storeMock;
	let nextMiddlewareMock;
	let sut;

	beforeEach(() => {
		storeMock = createStoreMock();
		nextMiddlewareMock = jest.fn();
		sut = createDryMiddleware(() => 'test-uid')(storeMock)(nextMiddlewareMock);
	});

	afterEach(jest.resetAllMocks);

	describe('when running a command', () => {
		beforeEach(() => {
			sut(runCommand('test command'));
		});

		it('pretends running the command', () => {
			expect(storeMock.dispatch).toHaveBeenNthCalledWith(1, started());
			expect(storeMock.dispatch).toHaveBeenNthCalledWith(2, outputReceived('pretending to run "test command"', 'test-uid'));
			expect(storeMock.dispatch).toHaveBeenNthCalledWith(3, finished('test command'));
			expect(storeMock.dispatch).toHaveBeenCalledTimes(3);
			expect(nextMiddlewareMock).not.toHaveBeenCalled();
		});
	});
});
