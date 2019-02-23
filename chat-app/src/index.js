import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


class Api {
    getMessages() {
        return fetch("/api/messages")
            .then(response => {
                if (response.ok) {
                    response.json();
                } else {
                    throw new Error('something went wrong');
                }
            });
    }
}

const api = new Api();

ReactDOM.render(<App getMessages={api.getMessages}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
