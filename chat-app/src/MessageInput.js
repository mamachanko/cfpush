import React, {useState} from 'react';
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = () => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        margin: '12px'
    },
    input: {
        flex: 1,
        marginLeft: 8
    },
    divider: {
        width: 1,
        height: 28,
        margin: 4
    },
    button: {
        padding: 10
    }
});

const MessageInput = ({postMessage, classes}) => {
    const [messageInput, setMessageInput] = useState("");

    const normalize = string => string.trim().replace(/\s\s+/g, ' ');

    const onSubmit = event => {
        if (messageInput === undefined) return;
        if (normalize(messageInput) === "") return;
        postMessage(normalize(messageInput));
        setMessageInput("");
        event.preventDefault();
    };

    return <form onSubmit={onSubmit}
                 className={classes.root}>
        <InputBase className={classes.input}
                   placeholder={"What's up?"}
                   value={messageInput}
                   onChange={(event) => setMessageInput(event.target.value)}
                   autoFocus
        />
        <Divider className={classes.divider}/>
        <IconButton className={classes.button}
                    color={"primary"}
                    variant={"fab"}
                    type={"submit"}
                    role={'button'}>
            <SendIcon/>
        </IconButton>
    </form>;
};

export default withStyles(styles)(MessageInput);
