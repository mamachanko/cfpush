import React from 'react';
import './App.css';
import Header from "./Header";
import MessageInput from './MessageInput';
import MessageListContainer from './MessageListContainer';
import {CssBaseline} from "@material-ui/core";

export default ({getMessages, postMessage}) => [
    <CssBaseline key={'css-baseline'}/>,
    <Header key={'header'}/>,
    <MessageListContainer key={'message-list'}
                          getMessages={getMessages}/>,
    <MessageInput key={'message-input'}
                  postMessage={postMessage}/>
];
