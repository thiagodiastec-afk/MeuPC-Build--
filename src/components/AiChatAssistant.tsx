import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  Loader2, 
  User, 
  Globe, 
  ExternalLink, 
  Search 
} from 'lucide-react';
import { BuildSelection } from '../types/pc';
import { SafeExternalLink } from './SafeExternalLink';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  groundingSources?: Array<{ title: string; url: string }>;
}

interface AiChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentBuild: BuildSelection;
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  isOpen,
  onClose,
  currentBuild,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Olá! Sou o Técnico Virtual MeuPC. Estou conectado com Google Search Grounding em tempo real para pesquisar preços, disponibilidade de estoque, benchmarks de jogos e compatibilidade no mercado brasileiro. Como posso ajudar com sua máquina hoje?',
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          currentBuild,
        }),
      });

      const data = await res.json();
      const aiReply = data?.reply || 'Desculpe, tive um problema temporário ao consultar o assistente.';
      const groundingSources = Array.isArray(data?.groundingSources) ? data.groundingSources : undefined;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        groundingSources,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error('Error in AI chat:', e);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Não consegui conectar ao servidor de IA no momento. Por favor tente novamente.',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'Qual a melhor GPU até R$ 2.000 no Brasil?',
    'Essa fonte aguenta a placa de vídeo?',
    'Vale a pena investir em DDR5 agora?',
    'Essa build roda GTA 6 e Cyberpunk?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end sm:p-6 p-2 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-2xl w-full max-w-md h-[85vh] sm:h-[650px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Técnico Virtual MeuPC</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  <Globe className="w-2.5 h-2.5" />
                  Google Search
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Consultas e benchmarks em tempo real no Brasil</p>
            </div>
          </div>

          <button
            id="close-ai-chat-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-transparent hover:border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed backdrop-blur-md ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20'
                    : 'bg-white/[0.04] text-slate-200 border border-white/10 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Grounding with Google Search Sources */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                      <Globe className="w-3 h-3" />
                      <span>Fontes Google Search Grounding:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {msg.groundingSources.slice(0, 3).map((source, sIdx) => (
                        <SafeExternalLink
                          key={sIdx}
                          href={source.url}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-200 border border-white/10 transition-colors"
                        >
                          <span className="truncate max-w-[140px]">{source.title || 'Página Web'}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                        </SafeExternalLink>
                      ))}
                    </div>
                  </div>
                )}

                <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                  {msg.time}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 justify-start items-center text-xs text-slate-400 bg-white/[0.03] backdrop-blur-md p-3 rounded-2xl border border-white/10 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <div className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Pesquisando no Google Search e formulando resposta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-white/[0.02] backdrop-blur-md border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 whitespace-nowrap transition-colors backdrop-blur-md"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-white/10 bg-slate-950/70 backdrop-blur-md flex items-center gap-2"
        >
          <input
            id="ai-chat-input"
            type="text"
            placeholder="Faça uma pergunta sobre sua máquina..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-slate-900/80 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500 backdrop-blur-md placeholder:text-slate-500"
          />
          <button
            id="send-ai-chat-btn"
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all font-bold shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
