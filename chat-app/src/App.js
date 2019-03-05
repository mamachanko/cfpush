import React from 'react';
import './App.css';
import Header from "./Header";
import MessageInput from './MessageInput';
import MessageListContainer from './MessageListContainer';

export default ({getMessages, postMessage}) => [
    <Header key={'header'}/>,
    <MessageListContainer key={'message-list'}
                          getMessages={getMessages}/>,
    <MessageInput key={'message-input'}
                  postMessage={postMessage}/>
];
