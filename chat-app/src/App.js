import React from 'react';
import './App.css';
import Header from "./Header";
import MessageInput from './MessageInput';
import MessageListContainer from './MessageListContainer';

export default ({getMessages, postMessage}) =>
    <div className="App">
        <Header/>
        <MessageInput postMessage={postMessage}/>
        <MessageListContainer getMessages={getMessages}/>
    </div>;
