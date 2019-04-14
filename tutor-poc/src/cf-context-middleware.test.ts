import {finished, updateCfContext} from './actions';
import {createCfContextMiddleware} from './cf-context-middleware';
import {createStoreMock} from './test-utils';

describe('CF Context Middleware', () => {
	let storeMock;
	let nextMiddlewareMock;
	let cfContextUpdater;
	let sut;

	beforeEach(() => {
		cfContextUpdater = jest.fn();
		storeMock = createStoreMock({
			commands: {
				current: {
					command: 'test command'
				}
			}
		});
		nextMiddlewareMock = jest.fn();
		sut = createCfContextMiddleware(cfContextUpdater)(storeMock)(nextMiddlewareMock);
	});

	afterEach(jest.resetAllMocks);

	describe('when command finishes', () => {
		describe('when there is an update to the cf context', () => {
			beforeEach(async () => {
				cfContextUpdater.mockResolvedValueOnce({an: {update: {to: ['the', 'cf', 'context']}}});
				await sut(finished());
			});

			it('invokes the cf context updater with the current command', () => {
				expect(cfContextUpdater).toHaveBeenCalledWith('test command');
				expect(cfContextUpdater).toHaveBeenCalledTimes(1);
			});

			it('updates the cf context', () => {
				expect(storeMock.dispatch).toHaveBeenCalledWith(updateCfContext({an: {update: {to: ['the', 'cf', 'context']}}}));
				expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
			});

			it('calls the next middleware', () => {
				expect(nextMiddlewareMock).toHaveBeenCalledWith(finished());
				expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
			});
		});

		describe('when there is no update to the cf context', () => {
			beforeEach(async () => {
				cfContextUpdater.mockResolvedValueOnce(null);
				await sut(finished());
			});

			it('invokes the cf context updater with the current command', () => {
				expect(cfContextUpdater).toHaveBeenCalledWith('test command');
				expect(cfContextUpdater).toHaveBeenCalledTimes(1);
			});

			it('does not update the cf context', () => {
				expect(storeMock.dispatch).not.toHaveBeenCalled();
			});

			it('calls the next middleware', () => {
				expect(nextMiddlewareMock).toHaveBeenCalledWith(finished());
				expect(nextMiddlewareMock).toHaveBeenCalledTimes(1);
			});
		});
	});
});
