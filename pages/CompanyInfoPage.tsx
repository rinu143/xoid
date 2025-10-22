import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

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

// --- Icons for Navigation ---
const icons: { [key: string]: React.ReactNode } = {
  contact: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  privacy: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  refunds: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>,
  terms: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  shipping: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

type InfoView = 'contact' | 'privacy' | 'refunds' | 'terms' | 'shipping';
interface NavItemType {
    id: InfoView;
    label: string;
    icon: React.ReactNode;
}

const navSections: { title: string; items: NavItemType[] }[] = [
    {
        title: "Support",
        items: [{ id: 'contact', label: 'Contact Us', icon: icons.contact }],
    },
    {
        title: "Policies",
        items: [
            { id: 'shipping', label: 'Shipping', icon: icons.shipping },
            { id: 'refunds', label: 'Refunds', icon: icons.refunds },
            { id: 'privacy', label: 'Privacy Policy', icon: icons.privacy },
            { id: 'terms', label: 'Terms & Conditions', icon: icons.terms },
        ],
    }
];

const allNavItems = navSections.flatMap(section => section.items);


const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3.5 px-3 py-2.5 text-sm rounded-lg transition-colors duration-200 relative ${
            isActive
                ? 'font-bold text-black'
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
        }`}
    >
       <span className={`absolute inset-0 rounded-lg transition-opacity ${isActive ? 'bg-gray-100' : 'opacity-0'}`}></span>
       <span className="relative z-10">{icon}</span>
       <span className="relative z-10">{label}</span>
    </button>
);

const ContactView: React.FC<{ onSubmit: (e: React.FormEvent<HTMLFormElement>) => void }> = ({ onSubmit }) => (
    <section>
        <div className="border-b border-gray-200/80 pb-6 mb-8">
            <h2 className="text-3xl font-bold text-black">Contact Us</h2>
            <p className="mt-2 text-gray-700 max-w-3xl">Have a question or need assistance? We're here to help. Reach out to us via the form below or through our contact details.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <div className="lg:w-2/5">
                <h3 className="text-2xl font-bold text-black">Get in Touch</h3>
                <p className="mt-2 text-gray-600">Our team is available to answer your questions from 9 AM to 6 PM IST, Monday to Friday.</p>
                
                 <div className="mt-8 space-y-6">
                    <div className="p-4 rounded-lg bg-gray-50/80 border border-gray-200/60">
                         <div className="flex items-start gap-4">
                            <div className="bg-gray-200 text-black rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center">
                               {icons.contact}
                            </div>
                            <div>
                                <h4 className="font-semibold text-black">Email Us</h4>
                                <a href="mailto:support@xoid.com" className="text-black font-medium hover:underline text-sm break-all">support@xoid.com</a>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50/80 border border-gray-200/60">
                        <div className="flex items-start gap-4">
                             <div className="bg-gray-200 text-black rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-black">Call Us</h4>
                                <a href="tel:+911234567890" className="text-black font-medium hover:underline text-sm">+91 9400106048</a>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>

            <div className="lg:w-3/5">
                <h3 className="text-2xl font-bold text-black">Send a Message</h3>
                <form onSubmit={onSubmit} className="mt-6 space-y-6">
                    <FloatingLabelInput label="Full Name" id="contact-name" name="name" type="text" required />
                    <FloatingLabelInput label="Email Address" id="contact-email" name="email" type="email" required />
                    <FloatingLabelTextarea label="Your Message" id="contact-message" name="message" rows={5} required />
                    <button type="submit" className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group">
                        <span>Send Message</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </button>
                </form>
            </div>
        </div>
    </section>
);

const PolicyView: React.FC<{ title: string; lastUpdated: string; children: React.ReactNode }> = ({ title, lastUpdated, children }) => (
    <section>
        <div className="border-b border-gray-200/80 pb-6 mb-8">
            <h2 className="text-3xl font-bold text-black">{title}</h2>
            <p className="mt-2 text-sm text-gray-500">Last updated on {lastUpdated}</p>
        </div>
        <div className="prose prose-lg max-w-none text-gray-700 prose-h4:mt-8 prose-h4:font-bold prose-h4:text-black">
            {children}
        </div>
    </section>
);

const MobileNavDropdown: React.FC<{
    activeView: InfoView;
    setActiveView: (view: InfoView) => void;
}> = ({ activeView, setActiveView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const activeItem = allNavItems.find(item => item.id === activeView);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (view: InfoView) => {
        setActiveView(view);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 bg-white py-3 px-4 text-base font-medium text-black transition-colors duration-200 hover:border-gray-400"
            >
                <span className="flex items-center gap-3">
                    {activeItem?.icon}
                    {activeItem?.label}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2">
                    {navSections.map((section, index) => (
                        <div key={section.title}>
                            {index > 0 && <hr className="my-2 border-gray-200" />}
                            <h3 className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">{section.title}</h3>
                            {section.items.map(item => (
                                <NavItem
                                    key={item.id}
                                    label={item.label}
                                    icon={item.icon}
                                    isActive={activeView === item.id}
                                    onClick={() => handleSelect(item.id)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CompanyInfoPage: React.FC = () => {
    const location = useLocation();
    const [activeView, setActiveView] = useState<InfoView>('contact');

    useEffect(() => {
        const hash = location.hash.substring(1);
        const validViews = allNavItems.map(item => item.id);

        if (hash && validViews.includes(hash as InfoView)) {
            setActiveView(hash as InfoView);
            const element = document.getElementById('info-content');
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            setActiveView('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.hash]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you shortly.');
        e.currentTarget.reset();
    };
    
    const renderContent = () => {
        switch (activeView) {
            case 'contact':
                return <ContactView onSubmit={handleFormSubmit} />;
            case 'privacy':
                return (
                    <PolicyView title="Privacy Policy" lastUpdated="October 21, 2025">
                        <p>Your privacy is important to us. It is XOID's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                        <h4>Information We Collect</h4>
                        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                        <p>In addition, for features such as Virtual Try-On, users may upload their photos to visualize products. These photos are processed temporarily to generate the try-on preview and are not stored, saved, or retained in our database after the session ends. We do not use, share, or reuse these images for any other purpose.</p>
                        <h4>Use of Information</h4>
                        <p>We use the information we collect to process transactions, send periodic emails, and improve our store. Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever without your consent, other than for the express purpose of delivering the purchased product or service requested.</p>
                        <h4>Security</h4>
                        <p>We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.</p>
                    </PolicyView>
                );
            case 'refunds':
                return (
                    <PolicyView title="Cancellation & Refund Policy" lastUpdated="October 21, 2025">
                        <p>At XOID, we strive to provide our customers with the best products and services. Please read our policy carefully before making a purchase.</p>
                        <h4>Cancellations</h4>
                        <p>Once an order has been placed and confirmed, it cannot be cancelled under any circumstances. We do not entertain any requests for order cancellations, modifications, or changes after the order is successfully placed.</p>
                        <h4>Returns & Replacements</h4>
                        <p>We maintain a strict no-return and no-exchange policy. Products once sold are not eligible for return, replacement, or exchange for any reason, including change of mind, wrong selection, or dissatisfaction.</p>
                        <h4>Damaged or Defective Products</h4>
                        <p>All products are thoroughly checked before dispatch. In the unlikely event that you receive a damaged or defective product, please contact our Customer Support immediately upon receipt with proper evidence (unboxing video and images). Such cases will be reviewed on a case-by-case basis, and XOID reserves the right to make the final decision regarding any resolution.</p>
                        <h4>Refunds</h4>
                        <p>Since cancellations and returns are not accepted, no refunds will be issued under any circumstances.</p>
                        <h4>Note</h4>
                        <p>By placing an order on our website, you acknowledge and agree to this Cancellation & Refund Policy.</p>
                    </PolicyView>
                );
            case 'terms':
                return (
                    <PolicyView title="Terms & Conditions" lastUpdated="October 21, 2025">
                        <p>For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean XOID, "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.</p>
                        <p>Your use of the website and/or purchase from us are governed by following Terms and Conditions:</p>
                        <ul>
                            <li>The content of the pages of this website is subject to change without notice.</li>
                            <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
                            <li>Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</li>
                            <li>Our website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
                            <li>All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</li>
                            <li>Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</li>
                            <li>From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.</li>
                            <li>You may not create a link to our website from another website or document without XOID's prior written consent.</li>
                            <li>Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.</li>
                            <li>We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time</li>
                        </ul>
                    </PolicyView>
                );
            case 'shipping':
                 return (
                    <PolicyView title="Shipping & Delivery Policy" lastUpdated="October 21, 2025">
                        <p>For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only. Orders are shipped within 8-14 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms. XOID is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 3-5 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation. Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration. For any issues in utilizing our services you may contact our helpdesk on +919400106048 or support@xoid.in</p>
                    </PolicyView>
                );
            default:
                return null;
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-widest">
                    Help & Information
                </h1>
                <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
                    Find answers to your questions, read our policies, or get in touch with our team.
                </p>
            </div>
            
            <div className="lg:hidden mb-8">
                <MobileNavDropdown activeView={activeView} setActiveView={setActiveView} />
            </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 items-start">
                {/* Navigation Sidebar */}
                <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-28">
                    <div className="p-2 bg-white border border-gray-200/80 rounded-xl">
                        <nav className="space-y-1">
                             {navSections.map((section, index) => (
                                <div key={section.title}>
                                    {index > 0 && <hr className="my-2 border-gray-200/60" />}
                                    <h3 className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{section.title}</h3>
                                    {section.items.map(item => (
                                       <NavItem
                                            key={item.id}
                                            label={item.label}
                                            icon={item.icon}
                                            isActive={activeView === item.id}
                                            onClick={() => setActiveView(item.id)}
                                        />
                                    ))}
                                </div>
                             ))}
                        </nav>
                    </div>
                </aside>

                {/* Content Area */}
                <main id="info-content" className="lg:col-span-9 scroll-mt-28 bg-white p-6 sm:p-8 rounded-xl border border-gray-200/80">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default CompanyInfoPage;