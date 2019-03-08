import React, {useEffect, useRef, useState} from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import {green} from "@material-ui/core/colors";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import MessageIcon from "@material-ui/icons/Message";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = () => ({
    loading: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    empty: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    error: {
        paddingBottom: '74px',
    },
    messageAvatar: {
        backgroundColor: green[500]
    },
    messageText: {
        wordBreak: 'break-word'
    }
});


const MessageListLoading = ({classes}) =>
    <div className={classes.loading}>
        <CircularProgress role="alert"
                          aria-busy={true}/>
    </div>;

const MessageListEmpty = ({classes}) =>
    <div className={classes.empty}>
        <Typography variant="h6"
                    color="inherit">
            {'There are no messages'}
        </Typography>
        <p>{'... so quiet'}</p>
    </div>;

const ScrollIntoView = ({classes}) => {
    const target = useRef(null);

    useEffect(() => {
        if (target.current != null) {
            target.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [target]);

    return <div className={classes.scrollIntoView}
                ref={element => {
                    target.current = element;
                }}>
    </div>
};

const MessageList = ({messages, classes}) => {
    return (messages.length === 0)
        ? <MessageListEmpty classes={classes}/>
        : <>
            <List data-testid={'message-list'}>
                {messages.reverse().map((message, index) =>
                    <ListItem key={index}>
                        <ListItemAvatar>
                            <Avatar className={classes.messageAvatar}>
                                <MessageIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={message}
                                      className={classes.messageText}/>
                    </ListItem>
                )}
            </List>
            <ScrollIntoView classes={classes}/>
        </>;
};

const MessagesError = ({classes}) =>
    <>
        <MessageListLoading classes={classes}/>
        <Snackbar open={true}
                  className={classes.error}
                  autoHideDuration={2000}
                  ContentProps={{'aria-describedby': 'message-id'}}
                  anchorOrigin={{horizontal: 'center', vertical: 'bottom'}}
                  message={
                      <span id="message-id">Failed to get messages. Weird.</span>
                  }
        />
    </>;

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

const MessageListContainer = ({getMessages, classes}) => {
    const [messages, isLoading, isError] = useMessages(getMessages);

    if (isLoading === true) return <MessageListLoading classes={classes}/>;
    if (isError === true) return <MessagesError classes={classes}/>;
    return <MessageList messages={messages} classes={classes}/>;
};

export default withStyles(styles)(MessageListContainer);