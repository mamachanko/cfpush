import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useState} from 'react';
import {faComment} from '@fortawesome/free-solid-svg-icons';
import {library} from "@fortawesome/fontawesome-svg-core";

library.add(faComment);

export default ({onSubmit}) => {
    const [messageInput, setMessageInput] = useState("");

    const onClick = () => {
        if (messageInput === "") {
            return
        }
        onSubmit(messageInput);
        setMessageInput("");
    };

    return <div className={"MessageInput"}>
        <input type={"text"}
               placeholder={"what's up?"}
               value={messageInput}
               onChange={(event) => setMessageInput(event.target.value)}
               autoFocus={true}/>
        <button type="button"
                onClick={onClick}>
            <FontAwesomeIcon icon={"comment"}/>
        </button>
    </div>
};
