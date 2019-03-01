import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('<App /> renders without crashing', () => {
  const div = document.createElement('div');

  const getMessages = () => new Promise(() => {});
  const postMessage = () => {};

  ReactDOM.render(
      <App getMessages={getMessages}
           postMessage={postMessage}/>,
      div
  );

  ReactDOM.unmountComponentAtNode(div);
});
