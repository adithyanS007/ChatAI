import React, { useState } from "react";
import axios from "axios";
import './chatApp.css';
import HomePage from './homepage';
import bgvdo from './assets/bg-video2.mp4';

function ChatApp() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showHomePage, setShowHomePage] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const LENGTH_THRESHOLD = 200;

    const generateAnswer = async () => {
        setMessages(prevMessages => [
            ...prevMessages,
            { role: "user", text: question },
            { role: "response", text: "loading..." }
        ]);
        setQuestion("");
        setLoading(true);

        try {
            const response = await axios({
                url: "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyD6suDC2UwRrkDxXawcgvbQYGAtIoNOjSs",
                method: "post",
                data: {
                    "contents": [
                        {
                            "role": "user",
                            "parts": [{ "text": question }]
                        }
                    ]
                }
            });

            const answer = response.data.candidates[0]?.content?.parts[0]?.text || "No response content";
            const shouldBeBulletPoints = answer.length > LENGTH_THRESHOLD;

            const formattedResponse = shouldBeBulletPoints
                ? <ul>{answer.split('\n').filter(line => line.trim()).map((line, index) => <li key={index}>{line}</li>)}</ul>
                : answer;

            setMessages(prevMessages => [
                ...prevMessages.slice(0, -1),
                { role: "response", text: formattedResponse }
            ]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages(prevMessages => [
                ...prevMessages.slice(0, -1),
                { role: "response", text: "Sorry, something went wrong." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDropdownClick = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const clearHistory = () => {
        setMessages([]);
    };

    return (
        <div className={`chat-app`}>
            <div className="bg-video">
            <video autoPlay loop muted >
            <source src={bgvdo} type='video/mp4'/>
        </video>
            </div>
            {!showHomePage && (
                <>
                    <button className="back-button" onClick={() => setShowHomePage(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M15.5 19l-7-7 7-7" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="dropdown-container">
                        <button className="dropdown-button" onClick={handleDropdownClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="17" r="2" />
                                <circle cx="12" cy="7" r="2" />
                            </svg>
                        </button>
                        {dropdownVisible && (
                            <div className="dropdown-menu">
                                <button onClick={clearHistory}>Clear History</button>
                                {/* <button onClick={() => alert('Settings')}>Settings</button>
                                <button onClick={() => alert('Log Out')}>Log Out</button> */}
                            </div>
                        )}
                    </div>
                </>
            )}
            {showHomePage ? (
                <HomePage onStart={() => setShowHomePage(false)} />
            ) : (
                <>
                    <h2>Nexus AI</h2>
                    <div className="chatbox">
                        {messages.length === 0 && !loading ? (
                            <div className="placeholder">No messages yet. Start the conversation!</div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.role}`}>
                                    {typeof msg.text === 'object' ? msg.text : msg.text}
                                    <div className="timestamp">{new Date().toLocaleTimeString()}</div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="input-container">
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Type a message..."
                            rows="2"
                        />
                        <button onClick={generateAnswer} disabled={loading}>
                            {loading ? '...' : '➤'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ChatApp;


