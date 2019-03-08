import React from 'react';
import MessageInput from './MessageInput';
import {cleanup, render, fireEvent} from "react-testing-library";

describe('<MessageInput />', () => {

    let postMessage,
        sendButton,
        messageInputField;

    beforeEach(() => {
        postMessage = jest.fn();
        const {getByRole, getByPlaceholderText} = render(<MessageInput postMessage={postMessage}/>);

        sendButton = getByRole('button');
        messageInputField = getByPlaceholderText(/what's up\?/i);
    });

    afterEach(cleanup);

    describe.each([
        ['simple message', 'simple message'],
        ['  simple message', 'simple message'],
        ['simple message   ', 'simple message'],
        ['simple  message', 'simple message'],
        ['\nsimple \n\tmessage       \n', 'simple message'],
    ])('when typing message "%s"', (typedMessage, expectedMessage) => {

        beforeEach(() => {
            fireEvent.change(messageInputField, {target: {value: typedMessage}});
        });

        describe('when sending the message', () => {

            beforeEach(() => {
                fireEvent.click(sendButton);
            });

            it(`posts normalized message "${expectedMessage}"`, () => {
                expect(postMessage).toHaveBeenCalledWith(expectedMessage);
            });

            it('clears the input', () => {
                expect(messageInputField.textContent).toEqual("");
            });
        });

    });

    describe.each([
        '',
        '\n',
        '\t',
        ' ',
        '   ',
        null,
        undefined
    ])('when typing blank message "%s"', (blankMessage) => {

        beforeEach(() => {
            fireEvent.change(messageInputField, {target: {value: blankMessage}});
        });

        describe('when clicking the send button', () => {

            beforeEach(() => {
                fireEvent.click(sendButton);
            });

            it('does not post a message', () => {
                expect(postMessage).not.toHaveBeenCalled();
            });

        });

    });
});