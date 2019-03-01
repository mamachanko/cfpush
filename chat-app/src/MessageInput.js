import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useState} from 'react';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import {library} from "@fortawesome/fontawesome-svg-core";

library.add(faComment);

export default ({postMessage}) => {
    const [messageInput, setMessageInput] = useState("");

    const normalize = string => string.trim().replace(/\s\s+/g, ' ');

    const onClick = () => {
        if (messageInput == undefined) return;
        if (normalize(messageInput) === "") return;
        postMessage(normalize(messageInput));
        setMessageInput("");
    };

    return <div className={"MessageInput"}>
        <input type={"text"}
               placeholder={"what's up?"}
               value={messageInput}
               onChange={(event) => setMessageInput(event.target.value)}
               autoFocus={true}/>
        <button type="button"
                data-testid={"postMessage"}
                onClick={onClick}>
            <FontAwesomeIcon icon={"comment"}/>
        </button>
    </div>
};
