import React, { useState } from 'react';

function SpeechInput() {
    const [text, setText] = useState('');

    const startListening = () => {
        const re = new (window.webkitSpeechRecognition)();
        re.lang = 'hi-IN';
        re.interimResults = false;
        re.maxAlternatives = 1;
        re.onresult = async (event) => {
            setText(event.results[0][0].transcript);
            try {
                const res = await fetch('http://localhost:8000/process', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transcript })
                });
                const data = await res.json();
                setResponse(data.result); 
            } catch (err) {
                console.error(err);
            }
        };

        re.start();
    };

    return (
        <div className="container">
            <button onClick={startListening}> Speak</button>
            <input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Your speech will appear here"
            />
        </div>
    );
}

export default SpeechInput;
