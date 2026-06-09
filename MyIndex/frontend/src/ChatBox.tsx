import { useState, useEffect, useRef } from 'react';
interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'bot', text: 'Olá! Sou o assistente virtual do Dev Oliver. Como posso te ajudar hoje?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processBotResponse = async (userInput: string) => {
    try {
      // 1. Faz a chamada HTTP direta para o servidor que você acabou de ligar no VS Code
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });
    
      if (!response.ok) {
        throw new Error('Erro na resposta do servidor');
      }

      const data = await response.json();
    
      // 2. Injeta a resposta ultra inteligente do Gemini na tela do chat
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'bot', text: data.reply }
      ]);

    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
    
      // 3. Resposta amigável de segurança caso seu backend seja desligado
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'bot', text: "No momento estou passando por uma manutenção no meu cérebro. Mas você pode falar direto com o Oliver clicando no botão do WhatsApp!" }
      ]);
    }
  };
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Adiciona mensagem do usuário
    const userMsgId = Date.now();
    setMessages(prev => [...prev, { id: userMsgId, sender: 'user', text: textToSend }]);
    setInputValue('');

    // Processa a resposta do robô
    processBotResponse(textToSend);
  };

  const handleQuickOption = (optionText: string) => {
    handleSendMessage(optionText);
  };

  return (
    <div className="chatbox-wrapper">
      {/* Botão Flutuante para abrir/fechar */}
      <button className="chatbox-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-comments"></i>}
      </button>

      {/* Janela do Chat */}
      {isOpen && (
        <div className="chatbox-window">
          <div className="chatbox-header">
            <div className="chatbox-avatar">🤖</div>
            <div>
              <h3>Oliver Bot</h3>
              <span>Online</span>
            </div>
          </div>

          <div className="chatbox-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbox-message-row ${msg.sender}`}>
                <div className="chatbox-bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Opções Rápidas de Clique */}
          <div className="chatbox-quick-options">
            <button onClick={() => handleQuickOption('Ver Projetos')}>📂 Ver Projetos</button>
            <button onClick={() => handleQuickOption('Pedir Orçamento')}>💰 Pedir Orçamento</button>
            <button onClick={() => handleQuickOption('Ver Currículo')}>📄 Ver Currículo</button>
          </div>

          {/* Campo de Input de Texto */}
          <form
            className="chatbox-input-area"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
          >
            <input
              type="text"
              placeholder="Digite sua dúvida aqui..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}