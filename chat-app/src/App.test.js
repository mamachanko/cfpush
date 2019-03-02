import React from 'react';
import {cleanup, render} from 'react-testing-library';
import App from './App';

beforeEach(cleanup);

it('<App /> renders without crashing', () => {

    const getMessages = jest.fn().mockResolvedValue([]);
    const postMessage = () => {
    };

    const {getByText} = render(<App getMessages={getMessages}
                                    postMessage={postMessage}/>);

    getByText(/there are no messages/);
});
