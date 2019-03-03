import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';

library.add(faExclamationTriangle);

const MessageListLoading = () =>
    <div className={'MessageListLoading'}>
        <p>loading messages</p>
    </div>;

const MessageListEmpty = () =>
    <div className={'MessageListEmpty'}>
        <p>there are no messages</p>
    </div>;

const MessageList = ({messages = []}) => {
    if (messages.length === 0) {
        return <MessageListEmpty/>
    } else {
        return <div className="messageList">
            {messages.map((message, index) => <p key={index}>{message}</p>)}
        </div>;
    }
};

const MessagesError = () =>
    <div className={'MessageListError'}>
        <p>
            <FontAwesomeIcon icon="exclamation-triangle"/>
            <span> failed to get messages</span>
        </p>
    </div>;

const MessageListContainer = ({getMessages}) => {

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const loadMessages = async () => {
        try {
            setMessages(await getMessages());
            setIsLoading(false);
            setIsError(false);
        } catch (e) {
            setIsLoading(false);
            setIsError(true);
        }
    };

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 1000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading === true) {
        return <MessageListLoading/>;

    } else if (isError === true) {
        return <MessagesError/>

    } else {
        return <MessageList messages={messages}/>;
    }
};

export default MessageListContainer;