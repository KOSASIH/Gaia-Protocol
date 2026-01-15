import React, { useState } from 'react';

function AIChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: input }]
      })
    });
    const data = await response.json();
    setMessages([...messages, { user: input, ai: data.choices[0].message.content }]);
    setInput('');
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>
            <p><strong>You:</strong> {msg.user}</p>
            <p><strong>AI:</strong> {msg.ai}</p>
          </div>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about Gaia Protocol..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default AIChatbot;
