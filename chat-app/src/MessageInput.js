import React, {useState} from 'react';
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";

export default ({postMessage}) => {
    const [messageInput, setMessageInput] = useState("");

    const normalize = string => string.trim().replace(/\s\s+/g, ' ');

    const onClick = () => {
        if (messageInput === undefined) return;
        if (normalize(messageInput) === "") return;
        postMessage(normalize(messageInput));
        setMessageInput("");
    };

    return <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        margin: '12px'
    }}>
        <InputBase style={{
            flex: 1,
            marginLeft: 8
        }}
                   placeholder={"What's up?"}
                   value={messageInput}
                   onChange={(event) => setMessageInput(event.target.value)}
                   autoFocus
        />
        <Divider style={{
            width: 1,
            height: 28,
            margin: 4
        }}/>
        <IconButton color={"primary"}
                    variant={"fab"}
                    style={{padding: 10}}
                    role={'button'}
                    onClick={onClick}>
            <SendIcon/>
        </IconButton>
    </div>;
};
