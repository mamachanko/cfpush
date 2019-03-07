import React from 'react';
import {cleanup, render, waitForElement} from 'react-testing-library';
import App from './App';


describe('<App />', () => {

    beforeEach(cleanup);

    it('shows empty messages and a title', async () => {

        const getMessages = jest.fn().mockResolvedValue([]);
        const postMessage = () => {
        };

        const {getByText} = render(<App getMessages={getMessages}
                                        postMessage={postMessage}/>);

        await waitForElement(() => [
            getByText(/cloud foundry tutorial chat/i),
            getByText(/there are no messages/i)
        ]);
    });

});

