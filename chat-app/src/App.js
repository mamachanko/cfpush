import React, {useState, useEffect} from 'react';
import './App.css';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComments, faExclamationTriangle, faComment} from '@fortawesome/free-solid-svg-icons';

library.add(faComments, faExclamationTriangle, faComment);

const Header = () =>
    <FontAwesomeIcon icon="comments"
                     className={"fa-4x"}
                     style={{margin: "32px 0px"}}/>;

const MessageInput = ({onSubmit}) => {
    const [messageInput, setMessageInput] = useState("");

    const onClick = () => {
        if (messageInput === "") {
            return
        }
        onSubmit(messageInput);
        setMessageInput("");
    };

    return <div>
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

const MessageList = ({messages = []}) => {
    if (messages.length === 0) {
        return <MessagesEmpty/>
    } else {
        return <div>
            {messages.map((message, index) => <p key={index}>{message.text}</p>)}
        </div>;
    }
};

const MessagesEmpty = () => <div className={'MessagesEmpty'}>
    <p>there are no messages</p>
</div>;

const MessagesError = () => <div className={'MessagesError'}>
    <p>
        <FontAwesomeIcon icon="exclamation-triangle"/>
        <span> failed to load messages</span>
    </p>
</div>;

const App = ({getMessages, postMessage}) => {
    const [messages, setMessages] = useState([]);
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
        const timer = setInterval(() => loadMessages(), 1000);
        return () => clearTimeout(timer);
    }, []);

    const messageList = isMessagesError ? <MessagesError/> : <MessageList messages={messages}/>;

    return (
        <div className="App">
            <Header/>
            <MessageInput onSubmit={postMessage}/>
            {messageList}
        </div>
    );
};

export default App;
