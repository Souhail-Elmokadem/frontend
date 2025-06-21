import React, { useState } from 'react';
import { marked } from 'marked';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Bonjour ! Posez-moi une question.", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await fetch('http://localhost:5005/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: inputMessage }),
      });

      const rawText = await response.text();
      let botResponse;

      try {
        const jsonData = JSON.parse(rawText);
        botResponse = jsonData.reponse || jsonData.message || jsonData.answer || rawText;
      } catch {
        botResponse = rawText;
      }

      // Nettoyage et affichage structuré
      botResponse = botResponse
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/v\.u\./g, '')
        .replace(/v\.v\./g, '');

      setMessages(prev => [...prev, {
        text: botResponse,
        sender: 'bot'
      }]);

    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, {
        text: "Désolé, service momentanément indisponible",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.sender === 'bot' ? (
              <div
                dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }}
              />
            ) : (
              msg.text
            )}
          </div>
        ))}
        {isLoading && <div className="message bot">Typing...</div>}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Posez votre question..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          {isLoading ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </div>
    </div>
  );
};

export default Chat;
