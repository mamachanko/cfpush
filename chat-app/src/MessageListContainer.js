import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useState} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import {green} from "@material-ui/core/colors";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import MessageIcon from "@material-ui/icons/Message";

library.add(faExclamationTriangle);

const MessageListLoading = () =>
    <div className={'MessageListLoading'}>
        <p>loading messages</p>
    </div>;

const MessageListEmpty = () =>
    <div className={'MessageListEmpty'}>
        <p>there are no messages</p>
    </div>;

const MessageList = ({messages}) =>
    (messages.length === 0)
        ? <MessageListEmpty/>
        : <List data-testid={'message-list'}>
            {messages.map((message, index) =>
                <ListItem key={index}>
                    <ListItemAvatar>
                        <Avatar style={{backgroundColor: green[500]}}>
                            <MessageIcon/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={message}/>
                </ListItem>
            )}
        </List>;

const MessagesError = () =>
    <div className={'MessageListError'}>
        <p>
            <FontAwesomeIcon icon="exclamation-triangle"/>
            <span> failed to get messages</span>
        </p>
    </div>;

const useMessages = getMessages => {
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

    return [messages, isLoading, isError];
};

export default ({getMessages}) => {
    const [messages, isLoading, isError] = useMessages(getMessages);

    if (isLoading === true) return <MessageListLoading/>;
    if (isError === true) return <MessagesError/>;

    return <Paper elevation={0} className={'content'}>
        <MessageList messages={messages}/>
    </Paper>;
};