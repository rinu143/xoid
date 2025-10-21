import React, { useEffect, useRef } from 'react';
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

// FIX: The `Section` component was incorrectly typed as a `React.FC`, which does not support the `ref` prop. Removed the type annotation to allow TypeScript to correctly infer the type from `React.forwardRef`.
const Section = React.forwardRef<HTMLElement, { id: string, title: string, children: React.ReactNode }>(({ id, title, children }, ref) => (
    <section id={id} ref={ref} className="mb-16 scroll-mt-28">
        <h2 className="text-3xl font-bold text-black mb-6 pb-2 border-b border-gray-200">{title}</h2>
        <div className="prose prose-lg max-w-none text-gray-700">
            {children}
        </div>
    </section>
));


const CompanyInfoPage: React.FC = () => {
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const location = useLocation();

    useEffect(() => {
        // A small delay to ensure the page has rendered before scrolling.
        const timer = setTimeout(() => {
            if (location.hash) {
                const id = location.hash.substring(1);
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    
        return () => clearTimeout(timer);
    }, [location.hash]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, you would handle form submission here.
        alert('Thank you for your message! We will get back to you shortly.');
        e.currentTarget.reset();
    };

    return (
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-widest">
                    Help & Information
                </h1>
                <p className="mt-4 text-lg text-gray-500 max-w-3xl mx-auto">
                    Find answers to your questions, read our policies, or get in touch with our team.
                </p>
            </div>
            <main>
                {/* FIX: The ref callback was implicitly returning a value, which is not allowed. Changed to a block statement to ensure a void return. */}
                <Section id="contact" title="Contact Us" ref={el => { sectionRefs.current[0] = el; }}>
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
                {/* FIX: The ref callback was implicitly returning a value, which is not allowed. Changed to a block statement to ensure a void return. */}
                <Section id="privacy" title="Privacy Policy" ref={el => { sectionRefs.current[1] = el; }}>
                    <p>Your privacy is important to us. It is XOID's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                    <h4>1. Information We Collect</h4>
                    <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                    <p>In addition, for features such as Virtual Try-On, users may upload their photos to visualize products. These photos are processed temporarily to generate the try-on preview and are not stored, saved, or retained in our database after the session ends. We do not use, share, or reuse these images for any other purpose.</p>
                    <h4>2. Use of Information</h4>
                    <p>We use the information we collect to process transactions, send periodic emails, and improve our store. Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever without your consent, other than for the express purpose of delivering the purchased product or service requested.</p>
                    <h4>3. Security</h4>
                    <p>We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.</p>
                </Section>
                {/* FIX: The ref callback was implicitly returning a value, which is not allowed. Changed to a block statement to ensure a void return. */}
                <Section id="refunds" title="Cancellation & Refund Policy" ref={el => { sectionRefs.current[2] = el; }}>
                    <p><em>Last updated on Oct 21, 2025</em></p>
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
                </Section>
                {/* FIX: The ref callback was implicitly returning a value, which is not allowed. Changed to a block statement to ensure a void return. */}
                <Section id="terms" title="Terms & Conditions" ref={el => { sectionRefs.current[3] = el; }}>
                    <p><em>Last updated on Oct 21 2025</em></p>
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
                </Section>
                 {/* FIX: The ref callback was implicitly returning a value, which is not allowed. Changed to a block statement to ensure a void return. */}
                 <Section id="shipping" title="Shipping & Delivery Policy" ref={el => { sectionRefs.current[4] = el; }}>
                    <p><em>Last updated on Oct 21 2025</em></p>
                    <p>For International buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only. For domestic buyers, orders are shipped through registered domestic courier companies and /or speed post only. Orders are shipped within 8-14 days or as per the delivery date agreed at the time of order confirmation and delivering of the shipment subject to Courier Company / post office norms. XOID is not liable for any delay in delivery by the courier company / postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 3-5 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation. Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration. For any issues in utilizing our services you may contact our helpdesk on +919400106048 or support@xoid.in</p>
                </Section>
            </main>
        </div>
    );
};

export default CompanyInfoPage;