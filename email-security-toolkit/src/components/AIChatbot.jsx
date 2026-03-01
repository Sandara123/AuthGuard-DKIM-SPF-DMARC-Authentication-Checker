import { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/aiService';
import './AIChatbot.css';

/**
 * AI Chatbot Component - Interactive AI assistant for email security questions
 */
export default function AIChatbot({ analysisContext, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m AuthGuard AI. I can help you understand email authentication, SPF, DKIM, DMARC, and security best practices. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async (retryCount = 0) => {
    const question = inputValue.trim();
    if (!question) return;

    // Add user message (only on first attempt)
    if (retryCount === 0) {
      const userMessage = {
        role: 'user',
        content: question,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
    }
    
    setIsTyping(true);

    try {
      // Call AI service
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const aiResponse = await chatWithAI(question, conversationHistory, analysisContext);

      // Check if AI is available
      if (!aiResponse) {
        // AI not available - show helpful message
        const fallbackMessage = {
          role: 'assistant',
          content: 'AI features are currently unavailable. To enable AI-powered insights, please configure your Anthropic API key in the .env file. The app will continue to work with standard email authentication analysis.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, fallbackMessage]);
        setIsTyping(false);
        return;
      }

      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      // Log error internally
      console.error('[Chatbot Error]', error);

      // Show user-friendly message
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ I encountered an error processing your question. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    'What is SPF and why is it important?',
    'How do I fix a DMARC policy?',
    'What are the risks of email spoofing?',
    'Explain DKIM signatures in simple terms',
    analysisContext ? `What should I fix first for ${analysisContext.domain}?` : null,
  ].filter(Boolean);

  const handleSuggestionClick = (question) => {
    setInputValue(question);
    sendMessage();
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-overlay" onClick={onClose}>
      <div className="chatbot-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <div className="chatbot-avatar">
              <span className="chatbot-avatar-icon">🤖</span>
              <span className="chatbot-status-dot"></span>
            </div>
            <div>
              <div className="chatbot-title">AuthGuard AI</div>
              <div className="chatbot-subtitle">Email Security Assistant</div>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button className="chatbot-close-btn" onClick={onClose} aria-label="Close chat">
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chatbot-message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'assistant' ? '🤖' : '👤'}
              </div>
              <div className="message-bubble">
                <div className="message-content">{msg.content}</div>
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chatbot-message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="chatbot-suggestions">
            <div className="suggestions-label">Try asking:</div>
            {suggestedQuestions.map((q, idx) => (
              <button 
                key={idx} 
                className="suggestion-chip"
                onClick={() => handleSuggestionClick(q)}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chatbot-input-area">
          <textarea
            ref={inputRef}
            className="chatbot-input"
            placeholder="Ask me anything about email security..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            disabled={isTyping}
          />
          <button 
            className="chatbot-send-btn" 
            onClick={sendMessage}
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10L18 2L10 18L8 11L2 10Z" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="chatbot-footer">
          <span className="chatbot-footer-text">
            Powered by Claude AI • {analysisContext ? `Analyzing ${analysisContext.domain}` : 'Ready to help'}
          </span>
        </div>
      </div>
    </div>
  );
}
