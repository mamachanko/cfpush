import React from 'react';
import {render, cleanup} from 'react-testing-library';
import MessageListContainer from "./MessageListContainer";

describe('<MessageListContainer />', () => {

    afterEach(cleanup);

    describe('when there are no messages', () => {

        it('shows a placeholder', () => {
            const {getByText} = render(
                <MessageListContainer messages={[]}/>
            );

            getByText('there are no messages');
        });

    });

    describe('when there are messages', () => {

        const messages = [
            'latest-message',
            'next-recent-message',
            'oldest-message',
        ];

        it('shows messages', () => {
            const {getByText} = render(
                <MessageListContainer messages={messages}/>
            );

            getByText(/latest-message/);
            getByText(/next-recent-message/);
            getByText(/oldest-message/);
        });

        it('shows messages in order', () => {
            const {container} = render(
                <MessageListContainer messages={messages}/>
            );

            const messageNodes = container.firstChild.childNodes;
            expect(messageNodes).toHaveLength(3);
            expect(messageNodes[0].textContent).toEqual('latest-message');
            expect(messageNodes[1].textContent).toEqual('next-recent-message');
            expect(messageNodes[2].textContent).toEqual('oldest-message');
        });
    });

    describe('when getting messages fails', () => {

        it('shows an error message', () => {
            const {getByText} = render(
                <MessageListContainer isMessagesError={true}/>
            );

            getByText(/failed to get messages/);
        });
    });

});
