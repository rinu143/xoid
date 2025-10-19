import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useToast } from './ToastProvider';

type View = 'chat' | 'contact' | 'faq';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const faqs = [
  {
    question: 'What are the shipping options?',
    answer: 'We offer standard shipping (5-7 business days) and express shipping (2-3 business days). All orders over $200 receive complimentary express shipping.',
  },
  {
    question: 'What is your return policy?',
    answer: 'You can return any unworn, unwashed item within 30 days of purchase for a full refund or exchange. Please visit our returns portal to initiate a return.',
  },
  {
    question: 'How do I care for my XOID tee?',
    answer: 'To maintain the quality of your oversized tee, we recommend machine washing cold, inside-out, with like colors. Tumble dry low or hang dry. Do not iron directly on any graphics.',
  },
  {
    question: 'How does sizing work?',
    answer: 'Our tees are designed for a deliberately oversized and relaxed fit. If you prefer a fit that is closer to the body, we recommend sizing down. Please refer to the size chart on each product page for detailed measurements.',
  },
];

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

const ChatView: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: "Hello! I'm the XOID Style Advisor. How can I help you today? Feel free to ask about products, sizing, or styling." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const systemInstruction = "You are a friendly and knowledgeable 'Style Advisor' for a luxury oversized t-shirt brand called XOID. Your tone should be helpful, sophisticated, and concise. Answer questions about products, sizing, materials, and styling. If you don't know an answer, politely say so. Do not discuss other brands or topics unrelated to XOID fashion.";
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: input,
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
                           <p className="text-sm">{msg.text}</p>
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
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
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

const FloatingLabelInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, id, ...props }) => (
    <div className="relative">
      <input id={id} placeholder=" " className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-black bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer" {...props} />
      <label htmlFor={id} className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
        {label}
      </label>
    </div>
);
const FloatingLabelTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, id, ...props }) => (
    <div className="relative">
      <textarea id={id} placeholder=" " className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-black bg-white rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-black peer" {...props} />
      <label htmlFor={id} className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
        {label}
      </label>
    </div>
);


const ContactView: React.FC = () => {
    const { addToast } = useToast();
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addToast('Your message has been sent! We will get back to you shortly.', 'success');
        e.currentTarget.reset();
    };

    return (
        <div className="p-6 overflow-y-auto">
            <h3 className="font-bold text-black text-lg mb-1">Contact Us</h3>
            <p className="text-sm text-gray-600 mb-6">Have a question? Fill out the form below and we'll get back to you within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
                <FloatingLabelInput label="Full Name" id="contact-name" name="name" type="text" required />
                <FloatingLabelInput label="Email Address" id="contact-email" name="email" type="email" required />
                <FloatingLabelTextarea label="Your Message..." id="contact-message" name="message" rows={5} required />
                <button type="submit" className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">Send Message</button>
            </form>
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

const FaqView: React.FC = () => (
    <div className="p-6 overflow-y-auto">
        <h3 className="font-bold text-black text-lg mb-4">Frequently Asked Questions</h3>
        <div className="space-y-1">
            {faqs.map((faq, index) => <FaqItem key={index} faq={faq} />)}
        </div>
    </div>
);


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
      case 'contact': return <ContactView />;
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
      <div className={`fixed inset-0 bg-black bg-opacity-25 z-[70] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <div
        className={`fixed bottom-24 right-6 z-[80] w-[calc(100vw-48px)] max-w-sm h-[70vh] max-h-[600px] bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/80 transition-all duration-300 ease-in-out origin-bottom-right transform ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'} ${positionClass}`}
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
            <TabButton label="Contact Us" isActive={activeView === 'contact'} onClick={() => setActiveView('contact')} />
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
