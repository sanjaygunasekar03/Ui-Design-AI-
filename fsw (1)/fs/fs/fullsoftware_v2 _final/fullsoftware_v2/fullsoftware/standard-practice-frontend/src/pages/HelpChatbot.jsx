import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, ChevronRight } from 'lucide-react';

const FAQ_DATA = [
  {
    question: "How do I create a new call batch?",
    answer: "To create a new batch, navigate to the 'Batches' page from the sidebar or click the '+ Create Call Batch' button. Follow the wizard steps: select a call type, choose a template, and then upload your patient/claim data."
  },
  {
    question: "What does 'IVR Only' mean?",
    answer: "IVR Only stands for Interactive Voice Response. These templates are designed for calls where our system interacts only with automated phone systems, typically used for quick status checks without speaking to a live agent."
  },
  {
    question: "How can I request a new call type?",
    answer: "If you don't see the specific call type you need, go to the 'Templates' section and click the 'Request' button at the top. You can then fill out a form with your requirements, and our team will review it."
  },
  {
    question: "Can I duplicate an existing template?",
    answer: "Yes! In the 'Templates' section, click the three dots (more actions) button on any template card and select 'Duplicate'. This will create an exact copy that you can then edit."
  },
  {
    question: "How do I check the status of my calls?",
    answer: "You can see live updates in the 'Dashboard' or go to the 'Batches' section. Clicking on a specific batch will show you the individual status of every call within that group."
  }
];

const HelpChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: "Hello! I'm your Standard Practice Assistant. How can I help you today?", time: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), type: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate bot thinking
    setTimeout(() => {
      findAnswer(text);
    }, 600);
  };

  const findAnswer = (query) => {
    const q = query.toLowerCase();
    const matched = FAQ_DATA.find(faq => q.includes(faq.question.toLowerCase()) || faq.question.toLowerCase().includes(q));

    let botResponse = "";
    if (matched) {
      botResponse = matched.answer;
    } else {
      botResponse = "I'm not sure about that. Try asking about 'creating batches', 'IVR only', or 'requesting call types'. Alternatively, you can contact our support team at support@standardpractice.com.";
    }

    const botMsg = { id: Date.now() + 1, type: 'bot', text: botResponse, time: new Date() };
    setMessages(prev => [...prev, botMsg]);
  };

  const handleQuickQuestion = (faq) => {
    handleSend(faq.question);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#00B8D9] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 animate-bounce"
        >
          <MessageCircle size={32} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[400px] h-[600px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-[#EAECEF] transition-all duration-300 scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-[#00B8D9] p-6 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Help Assistant</h3>
                <p className="text-xs text-white/80">Online | Powered by AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F9FAFB]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'user' ? 'bg-[#00B8D9] ml-2' : 'bg-[#F0F2F5] mr-2'}`}>
                    {msg.type === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-[#4A4F59]" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.type === 'user' 
                      ? 'bg-[#00B8D9] text-white rounded-br-none' 
                      : 'bg-white text-[#4A4F59] border border-[#EAECEF] rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions */}
          {messages.length === 1 && (
            <div className="px-6 pb-2 space-y-2">
              <p className="text-[10px] text-[#98A2B3] uppercase font-bold tracking-widest mb-1">Common Questions</p>
              <div className="flex flex-wrap gap-2">
                {FAQ_DATA.slice(0, 3).map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(faq)}
                    className="text-[11px] bg-white border border-[#D0D5DD] rounded-full px-3 py-1.5 text-[#4A4F59] hover:border-[#00B8D9] hover:text-[#00B8D9] transition-all flex items-center shadow-sm"
                  >
                    {faq.question}
                    <ChevronRight size={10} className="ml-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#EAECEF]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
                placeholder="Ask a question..."
                className="w-full pl-4 pr-12 py-3 bg-[#F7F8FA] border border-[#EAECEF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B8D9] text-sm"
              />
              <button 
                onClick={() => handleSend(inputValue)}
                className="absolute right-2 p-2 text-[#00B8D9] hover:bg-[#00B8D9]/10 rounded-lg transition-colors"
                disabled={!inputValue.trim()}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpChatbot;
