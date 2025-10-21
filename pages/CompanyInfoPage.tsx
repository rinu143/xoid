import React, { useState, useEffect, useRef } from 'react';

const navLinks = [
    { id: 'contact', label: 'Contact Us' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'refunds', label: 'Cancellations & Refunds' },
    { id: 'terms', label: 'Terms & Conditions' },
    { id: 'shipping', label: 'Shipping Policy' },
];

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

const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = React.forwardRef<HTMLElement, { id: string, title: string, children: React.ReactNode }>(({ id, title, children }, ref) => (
    <section id={id} ref={ref} className="mb-16 scroll-mt-28">
        <h2 className="text-3xl font-bold text-black mb-6 pb-2 border-b border-gray-200">{title}</h2>
        <div className="prose prose-lg max-w-none text-gray-700">
            {children}
        </div>
    </section>
));


const CompanyInfoPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('contact');
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-25% 0px -75% 0px', threshold: 0 }
        );

        const currentRefs = sectionRefs.current;
        currentRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, you would handle form submission here.
        alert('Thank you for your message! We will get back to you shortly.');
        e.currentTarget.reset();
    };

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
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12">
                <aside className="lg:col-span-3 lg:sticky lg:top-28 self-start mb-8 lg:mb-0">
                    <nav>
                        <ul className="space-y-2">
                            {navLinks.map(link => (
                                <li key={link.id}>
                                    <a
                                        href={`#${link.id}`}
                                        className={`block w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                                            activeSection === link.id
                                                ? 'bg-black text-white'
                                                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                                        }`}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
                <main className="lg:col-span-9">
                    <Section id="contact" title="Contact Us" ref={el => sectionRefs.current[0] = el}>
                        <p>Have a question or need assistance? We're here to help. Reach out to us via the form below or through our contact details.</p>
                        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-12 not-prose">
                            {/* Left Info Panel */}
                            <div className="lg:col-span-2 bg-gray-50 rounded-xl p-8">
                                <h3 className="text-2xl font-bold text-black">Get in Touch</h3>
                                <p className="mt-2 text-gray-600 text-sm">Our team is available to answer your questions from 9 AM to 6 PM IST, Monday to Friday.</p>
                                
                                <ul className="mt-8 space-y-6">
                                    <li className="flex items-start gap-4">
                                        <div className="bg-black text-white rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-black">Email Us</h4>
                                            <p className="text-gray-600 text-sm">Send us an email for inquiries.</p>
                                            <a href="mailto:support@xoid.com" className="text-black font-medium hover:underline text-sm break-all">support@xoid.com</a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <div className="bg-black text-white rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-black">Call Us</h4>
                                            <p className="text-gray-600 text-sm">Speak directly with our team.</p>
                                            <a href="tel:+911234567890" className="text-black font-medium hover:underline text-sm">+91 9400106048</a>
                                        </div>
                                    </li>
                                </ul>
                                
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h4 className="font-semibold text-black">Follow Us</h4>
                                    <div className="flex space-x-4 mt-4">
                                        <a href="#" className="text-gray-500 hover:text-black transition-colors" aria-label="Twitter"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
                                        <a href="#" className="text-gray-500 hover:text-black transition-colors" aria-label="Instagram"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218 1.791.465 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 4.525c.636-.247 1.363-.416 2.427-.465C9.795 2.013 10.148 2 11.172 2h1.143zM12 7.167a4.833 4.833 0 100 9.666 4.833 4.833 0 000-9.666zM12 15a3 3 0 110-6 3 3 0 010 6zm4.805-7.778a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" clipRule="evenodd" /></svg></a>
                                    </div>
                                </div>
                            </div>

                             {/* Right Form Panel */}
                            <div className="lg:col-span-3">
                                <h3 className="text-2xl font-bold text-black">Send a Message</h3>
                                <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
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
                    </Section>
                    <Section id="privacy" title="Privacy Policy" ref={el => sectionRefs.current[1] = el}>
                        <p>Your privacy is important to us. It is XOID's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                        <h4>1. Information We Collect</h4>
                        <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                        <h4>2. Use of Information</h4>
                        <p>We use the information we collect to process transactions, send periodic emails, and improve our store. Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent, other than for the express purpose of delivering the purchased product or service requested.</p>
                        <h4>3. Security</h4>
                        <p>We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.</p>
                    </Section>
                    <Section id="refunds" title="Cancellations & Refunds" ref={el => sectionRefs.current[2] = el}>
                        <h4>Returns</h4>
                        <p>Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
                        <h4>Refunds (if applicable)</h4>
                        <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your original method of payment, within a certain amount of days.</p>
                        <h4>Cancellations</h4>
                        <p>You can cancel your order within 24 hours of placing it, provided it has not already been shipped. Please contact our support team immediately to request a cancellation.</p>
                    </Section>
                    <Section id="terms" title="Terms & Conditions" ref={el => sectionRefs.current[3] = el}>
                        <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use XOID if you do not agree to take all of the terms and conditions stated on this page.</p>
                        <h4>Intellectual Property</h4>
                        <p>The content on this website, including text, graphics, logos, images, and software, is the property of XOID and is protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute any content from this site without our prior written permission.</p>
                        <h4>User Account</h4>
                        <p>If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.</p>
                    </Section>
                     <Section id="shipping" title="Shipping Policy" ref={el => sectionRefs.current[4] = el}>
                        <h4>Order Processing</h4>
                        <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery.</p>
                        <h4>Shipping Rates & Delivery Estimates</h4>
                        <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
                        <ul>
                            <li><strong>Standard Shipping:</strong> 5-7 business days.</li>
                            <li><strong>Express Shipping:</strong> 2-3 business days.</li>
                            <li><strong>International Shipping:</strong> 10-15 business days.</li>
                        </ul>
                        <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).</p>
                    </Section>
                </main>
            </div>
        </div>
    );
};

export default CompanyInfoPage;