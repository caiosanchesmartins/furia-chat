import React, { useState } from "react";
import "./FuriaChat.css"; 

const messagesMock = [
  { sender: "bot", text: "🔥 Bem-vindo ao FURIA Chat! Como posso te ajudar hoje?" },
  { sender: "bot", text: "Escolha uma opção abaixo ou digite sua pergunta." }
];

const options = [
  "🗓️ Próximo Jogo",
  "📊 Estatísticas",
  "🎮 Jogar Quiz",
  "🧢 Produtos Oficiais"
];

//API da LLAMIA responsavel por responder o chat
const llamaAPIKey = "f60655e8a9de6f47aaac9598a73bd23b85b69d0e7e3f15cff3c3243c40aa51d2";

export default function FuriaChat() {
  const [messages, setMessages] = useState(messagesMock);
  const [input, setInput] = useState("");

  const sendMessageToLlama3 = async (userText) => {
    try {
      const response = await fetch("https://api.together.xyz/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${llamaAPIKey}`
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3-8b-chat-hf",
          messages: [
            { role: "system", content: "Você é um assistente útil para fãs da FURIA." },
            { role: "user", content: userText }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API LLaMA 3:", errorData);
        throw new Error(`Erro: ${errorData.error.message}`);
      }

      const data = await response.json();
      const botReply = data.choices[0].message.content.trim();
      return botReply;
    } catch (error) {
      console.error("Erro ao chamar a API LLaMA 3:", error);
      return "Desculpe, ocorreu um erro. Tente novamente mais tarde.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const reply = await sendMessageToLlama3(input);
    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
  };

  const handleOptionClick = async (option) => {
    const userMessage = { sender: "user", text: option };
    setMessages((prev) => [...prev, userMessage]);

    const reply = await sendMessageToLlama3(option);
    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">FURIA Chat</h1>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-options">
        {options.map((opt, idx) => (
          <button key={idx} className="chat-button" onClick={() => handleOptionClick(opt)}>
            {opt}
          </button>
        ))}
      </div>
      <div className="chat-input-group">
        <input
          type="text"
          className="chat-input"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="chat-send" onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}
