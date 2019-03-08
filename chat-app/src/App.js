import React from 'react';
import './App.css';
import Header from "./Header";
import MessageInput from './MessageInput';
import MessageListContainer from './MessageListContainer';
import {CssBaseline} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

export default ({getMessages, postMessage}) => [
    <CssBaseline key={'css-baseline'}/>,
    <Paper elevation={1}
           className={'header'}>
        <Header key={'header'}/>
    </Paper>,
    <Paper elevation={0}
           className={'content'}>
        <MessageListContainer key={'message-list'}
                              getMessages={getMessages}/>
    </Paper>,
    <Paper elevation={1}
           className={'footer'}>
        <MessageInput key={'message-input'}
                      postMessage={postMessage}/>
    </Paper>
];
