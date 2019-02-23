import React, {useState, useEffect} from 'react';
import './App.css';
import {library} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComments} from '@fortawesome/free-solid-svg-icons';

library.add(faComments);

const Header = () =>
    <FontAwesomeIcon icon="comments"
                     className={"fa-4x"}
                     style={{margin: "32px 0px"}}/>;

const MessageList = ({messages = []}) => {
    if (messages.length === 0) {
        return <div>
            <p>[there are no messages]</p>
        </div>
    } else {
        return <div>
            {messages.map((message, index) => <p key={index}>{message.text}</p>)}
        </div>;
    }
};

const App = ({getMessages}) => {
    const [messages, setMessages] = useState([]);

    const loadMessages = () => {
        getMessages()
            .then(messages => {
                setMessages(messages);
                console.log("loaded messages");
            });
    };

    useEffect(() => {
        loadMessages();
        const timer = setInterval(() => loadMessages(), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="App">
            <Header/>
            <MessageList messages={messages}/>
        </div>
    );
};

export default App;
