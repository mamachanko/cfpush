import React, {useEffect, useState} from 'react';
import './App.css';
import Header from "./Header";
import MessageInput from './MessageInput';
import MessageListContainer from './MessageListContainer';

const useMessages = getMessages => {
    const initialMessages = {_embedded: {messages: []}};
    const [messages, setMessages] = useState(initialMessages);
    const [isMessagesError, setIsMessagesError] = useState(false);

    const loadMessages = () => {
        getMessages()
            .then(messages => {
                setIsMessagesError(false);
                setMessages(messages);
            })
            .catch((error) => {
                setIsMessagesError(true);
                console.log(error);
            });
    };

    useEffect(() => {
        loadMessages();
        const timer = setInterval(loadMessages, 1000);
        return () => clearTimeout(timer);
    }, []);

    return {messages, isMessagesError};
};

export default ({getMessages, postMessage}) => {

    const {messages, isMessagesError} = useMessages(getMessages);

    return (
        <div className="App">
            <Header/>
            <MessageInput onSubmit={postMessage}/>
            <MessageListContainer messages={messages}
                                  isMessagesError={isMessagesError}/>
        </div>
    );
};
