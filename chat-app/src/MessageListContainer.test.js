import React from 'react';
import {cleanup, render, waitForElement} from 'react-testing-library';
import MessageListContainer from "./MessageListContainer";

describe('<MessageListContainer />', () => {

    beforeAll(() => {
        if (!HTMLElement.prototype.scrollIntoView) {
            HTMLElement.prototype.scrollIntoView = () => {}
        }
    })

    afterEach(() => {
        cleanup();
    });

    describe('when just rendered', () => {

        it('says its loading messages', () => {
            const getMessagesStub = jest.fn();

            const {getByRole} = render(<MessageListContainer getMessages={getMessagesStub}/>);

            getByRole('alert');
        });

        describe('when starting to poll messages', () => {

            describe('when there are no messages', () => {

                it('shows a placeholder', async () => {
                    const getMessagesStub = jest.fn().mockResolvedValue([]);

                    const {getByText} = render(
                        <MessageListContainer getMessages={getMessagesStub}/>
                    );

                    await waitForElement(() => getByText(/there are no messages/i));
                });

            });

            describe('when there are messages', () => {

                it('shows messages', async () => {
                    const getMessagesStub = jest.fn()
                        .mockResolvedValueOnce(['a', 'b', 'c']);

                    jest.useFakeTimers();

                    const {getByText} = render(
                        <MessageListContainer getMessages={getMessagesStub}/>
                    );

                    jest.useRealTimers();

                    await waitForElement(() => [
                        getByText(/a/),
                        getByText(/b/),
                        getByText(/c/)
                    ]);
                });

                it('shows messages in order', async () => {
                    const getMessagesStub = jest.fn()
                        .mockResolvedValueOnce([
                            'latest-message',
                            'next-recent-message',
                            'oldest-message'
                        ]);

                    const {getByText, getByTestId} = render(
                        <MessageListContainer getMessages={getMessagesStub}/>
                    );

                    jest.useRealTimers();
                    await waitForElement(() => getByText(/message/));

                    const messageNodes = getByTestId('message-list').childNodes;
                    expect(messageNodes).toHaveLength(3);
                    expect(messageNodes[0].textContent).toEqual('oldest-message');
                    expect(messageNodes[1].textContent).toEqual('next-recent-message');
                    expect(messageNodes[2].textContent).toEqual('latest-message');
                });

                it('keeps polling for messages', async () => {
                    const getMessagesStub = jest.fn()
                        .mockResolvedValueOnce(['a', 'b', 'c'])
                        .mockResolvedValueOnce(['x'])
                        .mockResolvedValueOnce(['one', 'two']);

                    jest.useFakeTimers();

                    const {getByText} = render(
                        <MessageListContainer getMessages={getMessagesStub}/>
                    );

                    jest.useRealTimers();

                    await waitForElement(() => [
                        getByText(/a/),
                        getByText(/b/),
                        getByText(/c/)
                    ]);

                    jest.useFakeTimers();
                    jest.advanceTimersByTime(1000);
                    jest.useRealTimers();

                    await waitForElement(() => [
                        getByText(/x/)
                    ]);

                    jest.useFakeTimers();
                    jest.advanceTimersByTime(1000);
                    jest.useRealTimers();

                    await waitForElement(() => [
                        getByText(/one/),
                        getByText(/two/),
                    ]);
                });

            });

            describe('when getting messages fails', () => {

                it('shows an error message', async () => {
                    const getMessagesStub = jest.fn()
                        .mockRejectedValueOnce(new Error('get-messages-test-error'));

                    const {getByText} = render(
                        <MessageListContainer getMessages={getMessagesStub}/>
                    );

                    jest.useRealTimers();
                    await waitForElement(() => getByText(/failed to get messages/));
                });
            });

        });

    });

});
