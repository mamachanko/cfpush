import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useEffect, useRef, useState} from 'react';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import {green} from "@material-ui/core/colors";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import MessageIcon from "@material-ui/icons/Message";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

library.add(faExclamationTriangle);

const MessageListLoading = () =>
    <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <CircularProgress role="alert" ariaBusy="true"/>
    </div>;

const MessageListEmpty = () =>
    <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    }}>
        <Typography variant="h6"
                    color="inherit">
            {'There are no messages'}
        </Typography>
        <p>{'... so quiet'}</p>
    </div>;

const ScrollIntoView = () => {
    const target = useRef(null);

    useEffect(() => {
        if (target.current != null) {
            target.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [target]);

    return <div style={{float: "left", clear: "both"}}
                ref={element => {
                    target.current = element;
                }}>
    </div>
};

const MessageList = ({messages}) => {
    return (messages.length === 0)
        ? <MessageListEmpty/>
        : <>
            <List data-testid={'message-list'}>
                {messages.reverse().map((message, index) =>
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar style={{backgroundColor: green[500]}}>
                                <MessageIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={message}
                                      style={{wordBreak: 'break-word'}}/>
                    </ListItem>
                )}
            </List>
            <ScrollIntoView/>
        </>;
};

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
    return <MessageList messages={messages}/>;
};