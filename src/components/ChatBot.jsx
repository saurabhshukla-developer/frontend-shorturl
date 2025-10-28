import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../services/chatbotService.js';
import toast from 'react-hot-toast';
import { 
  PaperAirplaneIcon, 
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const response = await getChatHistory();
      if (response.success && response.data.messages && response.data.messages.length > 0) {
        // Convert history to message format
        const historyMessages = response.data.messages.map((msg, index) => ({
          id: index + 1,
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp
        }));
        setMessages(historyMessages);
      } else {
        // Set default welcome message if no history
        setMessages([
          {
            id: 1,
            text: 'Hello! 👋 I\'m your AI assistant for managing URLs. I can help you:\n\n• Create new short URLs\n• List and search your URLs\n• Analyze URL performance\n• Get detailed analytics\n\nWhat would you like to do?',
            sender: 'bot'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Set default welcome message on error
      setMessages([
        {
          id: 1,
          text: 'Hello! 👋 I\'m your AI assistant for managing URLs. I can help you:\n\n• Create new short URLs\n• List and search your URLs\n• Analyze URL performance\n• Get detailed analytics\n\nWhat would you like to do?',
          sender: 'bot'
        }
      ]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Format bot messages with proper text wrapping
  const formatBotMessage = (text) => {
    // Split the text into lines
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Check if line contains markdown-style bold (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        // Add the bold text
        parts.push(<span key={`bold-${index}-${match.index}`} className="font-bold text-gray-900">{match[1]}</span>);
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }
      
      // If no bold found, return the line as is
      if (parts.length === 0) {
        parts.push(line);
      }
      
      return (
        <div key={index} className="leading-relaxed break-words">
          {parts}
        </div>
      );
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(input);
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      toast.error('Failed to send message. Please try again.');
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = async () => {
    try {
      await clearChatHistory();
      setMessages([
        {
          id: 1,
          text: 'Chat cleared. How can I help you today?',
          sender: 'bot'
        }
      ]);
      toast.success('Chat history cleared');
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      toast.error('Failed to clear chat history');
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50 group"
          aria-label="Open chatbot"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[640px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                  <SparklesIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Assistant</h3>
                  <p className="text-xs text-blue-100">Powered by SnipURL</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110"
                  title="Clear chat"
                  aria-label="Clear chat"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110"
                  aria-label="Close chatbot"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4 space-y-3 scroll-smooth">
            <style>
              {`
                /* Custom scrollbar */
                .overflow-y-auto::-webkit-scrollbar {
                  width: 6px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                  background: transparent;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 10px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `}
            </style>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex animate-in fade-in slide-in-from-bottom-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="flex-shrink-0 mr-2 mt-1">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      AI
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md transition-all duration-200 hover:shadow-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                  }`}
                >
                  <div className="text-sm leading-relaxed break-words whitespace-pre-wrap word-break">
                    {message.sender === 'bot' ? formatBotMessage(message.text) : message.text}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 ml-2 mt-1">
                    <div className="w-7 h-7 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                      You
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-gray-100 rounded-tl-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Container */}
          <div className="border-t border-gray-100 p-3 bg-white shadow-lg">
            <form onSubmit={handleSend} className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim() && !isLoading) {
                        handleSend(e);
                      }
                    }
                  }}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="flex-1 w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md resize-none min-h-[44px] max-h-[120px]"
                  disabled={isLoading}
                  rows={1}
                  style={{ maxHeight: '120px' }}
                  onInput={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100 h-[44px]"
                aria-label="Send message"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

