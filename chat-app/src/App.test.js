import React from 'react';
import {cleanup, render, waitForElement} from 'react-testing-library';
import App from './App';

beforeEach(cleanup);

it('<App /> renders without crashing', async () => {

    const getMessages = jest.fn().mockResolvedValue([]);
    const postMessage = () => {
    };

    const {getByText} = render(<App getMessages={getMessages}
                                    postMessage={postMessage}/>);

    await waitForElement(() => getByText(/there are no messages/));
});
