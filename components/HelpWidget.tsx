import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { websiteContent } from '../data/websiteContent';
import { allFaqs } from '../data/faqs';

type View = 'chat' | 'faq';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface Faq {
    question: string;
    answer: string;
}

// --- Sub-components for the Help Drawer ---

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 px-3 py-2 text-sm font-bold text-center transition-all duration-300 rounded-md ${
      isActive ? 'bg-white text-black shadow-sm' : 'bg-transparent text-gray-500 hover:text-black'
    }`}
  >
    {label}
  </button>
);

// --- UPDATED ChatView with grounding ---
const ChatView: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: "Hello! I'm the XOID Style Advisor. How can I assist you with our collection or policies?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const systemInstruction = `You are a 'Style Advisor' for a luxury t-shirt brand, XOID. Your ONLY source of information is the text provided below under 'WEBSITE CONTENT'. You MUST answer user questions based exclusively on this content. If the answer cannot be found in the provided text, you MUST state 'I'm sorry, but I don't have that information. You can find our policies on the Help & Information page or contact support directly.' Do not use any external knowledge. Keep your answers concise and helpful.`;
            
            const fullPrompt = `WEBSITE CONTENT:\n${websiteContent}\n\n---\n\nUSER QUESTION:\n${currentInput}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: fullPrompt,
                config: { systemInstruction }
            });

            const botMessage: ChatMessage = { sender: 'bot', text: response.text };
            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: ChatMessage = { sender: 'bot', text: "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2.5 rounded-2xl ${msg.sender === 'user' ? 'bg-black text-white rounded-br-lg' : 'bg-gray-100 text-black rounded-bl-lg'}`}>
                           <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-lg">
                           <div className="flex space-x-1.5">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                           </div>
                        </div>
                    </div>
                 )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question..."
                        className="flex-1 w-full bg-gray-100 border-transparent rounded-full py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/50"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-black text-white rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

const FaqItem: React.FC<{ faq: { question: string; answer: string; } }> = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200/80">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4 group">
                <span className="font-semibold text-black text-sm group-hover:text-gray-700 transition-colors">{faq.question}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <p className="text-gray-600 text-sm pb-4">{faq.answer}</p>
                </div>
            </div>
        </div>
    );
};

// Helper function to shuffle an array (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- OPTIMIZED FaqView for instant loading ---
const FaqView: React.FC = () => {
    const [faqs, setFaqs] = useState<Faq[]>([]);

    useEffect(() => {
        // On component mount, shuffle the master list and take the first 5
        const randomFaqs = shuffleArray(allFaqs).slice(0, 5);
        setFaqs(randomFaqs);
    }, []);

    return (
        <div className="p-6 overflow-y-auto h-full">
            <h3 className="font-bold text-black text-lg mb-4">Frequently Asked Questions</h3>
            {faqs.length > 0 ? (
                <div className="space-y-1">
                    {faqs.map((faq, index) => <FaqItem key={index} faq={faq} />)}
                </div>
            ) : (
                // A fallback in case something goes wrong
                 <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
                </div>
            )}
        </div>
    );
};


// --- Main Help Widget Component ---

const HelpWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('chat');
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('app-footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    observer.observe(footer);
    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'chat': return <ChatView />;
      case 'faq': return <FaqView />;
      default: return <ChatView />;
    }
  };
  
  const positionClass = isFooterVisible ? '-translate-y-[90px]' : 'translate-y-0';

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close help widget" : "Open help widget"}
        aria-expanded={isOpen}
        className={`fixed bottom-6 right-6 z-[80] bg-black text-white rounded-full h-14 w-14 flex items-center justify-center shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${positionClass}`}
      >
        <div className="relative h-7 w-7 flex items-center justify-center">
            {/* Close Icon (X) */}
            <svg xmlns="http://www.w3.org/2000/svg" className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {/* Help Icon (?) */}
            <svg xmlns="http://www.w3.org/2000/svg" className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
      </button>

      {/* Help Drawer */}
      <div
        className={`fixed bottom-44 right-6 z-[80] w-[calc(100vw-48px)] max-w-sm h-[70vh] max-h-[600px] bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/80 transition-all duration-300 ease-in-out origin-bottom-right transform ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'} ${positionClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-widget-title"
      >
        <header className="flex-shrink-0 p-4 border-b border-gray-200/80 bg-white/80 backdrop-blur-sm">
            <h2 id="help-widget-title" className="font-bold text-lg text-black text-center">XOID Help Center</h2>
        </header>
        
        <div className="p-2 border-b border-gray-200/80">
          <div className="flex justify-around bg-gray-100 rounded-lg p-1">
            <TabButton label="Live Chat" isActive={activeView === 'chat'} onClick={() => setActiveView('chat')} />
            <TabButton label="FAQ" isActive={activeView === 'faq'} onClick={() => setActiveView('faq')} />
          </div>
        </div>
        
        <div className="flex-grow overflow-hidden">
            {renderView()}
        </div>
      </div>
    </>
  );
};

export default HelpWidget;