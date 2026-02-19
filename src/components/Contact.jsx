import { useState } from 'react';
import { SendIcon, PhoneIcon, MapPinIcon, MailIcon, LoaderIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import Title from './Title';
import { PrimaryButton } from './Buttons';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabaseClient';

const contactInfo = [
    {
        icon: <PhoneIcon className="size-5 text-blue-400" />,
        label: 'Phone',
        value: '+91 99342-95957',
        href: 'tel:+919934295957',
    },
    {
        icon: <MailIcon className="size-5 text-blue-400" />,
        label: 'Email',
        value: 'info@digitalservices.com',
        href: 'mailto:info@digitalservices.com',
    },
    {
        icon: <MapPinIcon className="size-5 text-blue-400" />,
        label: 'Office',
        value: 'Noor Compound, Dak Bunglow Rd, opp. Surya Hotel, Gaya, Bihar 823001',
    },
];

// EmailJS config
const EMAILJS_SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const emailjsConfigured = EMAILJS_SERVICE && EMAILJS_SERVICE !== 'your_service_id';

async function saveToSupabase(data) {
    const { error } = await supabase
        .from('submissions')
        .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone,
            problem: data.problem,
            message: data.message,
            status: 'pending'
        }]);
    
    if (error) throw new Error(error.message);
    return { success: true };
}

async function sendViaEmailJS(data) {
    if (!emailjsConfigured) return null;
    const templateParams = {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone || 'Not provided',
        subject: data.problem || 'General Inquiry',
        message: data.message,
    };
    return emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, templateParams, EMAILJS_PUBLIC_KEY);
}

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', problem: '', message: ''
    });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        try {
            // Send to both in parallel — Supabase saves data, EmailJS sends email
            const results = await Promise.allSettled([
                saveToSupabase(formData),
                sendViaEmailJS(formData),
            ]);

            const dbResult = results[0];
            const emailjsResult = results[1];

            // Check if at least one succeeded
            if (dbResult.status === 'fulfilled') {
                setStatus('success');
                setStatusMessage('Your message has been received! We\'ll get back to you soon.');
            } else if (emailjsResult.status === 'fulfilled' && emailjsResult.value !== null) {
                setStatus('success');
                setStatusMessage('Message sent via email! We\'ll get back to you soon.');
            } else {
                // Both failed
                throw new Error(dbResult.reason?.message || 'Failed to send message');
            }

            // Log results for debugging
            if (dbResult.status === 'rejected') {
                console.warn('Database submission failed:', dbResult.reason?.message);
            }
            if (emailjsResult.status === 'rejected') {
                console.warn('EmailJS failed:', emailjsResult.reason?.message);
            }

            // Reset form
            setFormData({ name: '', email: '', phone: '', problem: '', message: '' });

            // Reset status after 5 seconds
            setTimeout(() => {
                setStatus('idle');
                setStatusMessage('');
            }, 5000);

        } catch (err) {
            setStatus('error');
            setStatusMessage(err.message || 'Something went wrong. Please try again or call us directly.');
            setTimeout(() => {
                setStatus('idle');
                setStatusMessage('');
            }, 5000);
        }
    };

    return (
        <section id="contact" className="py-20 bg-white/3 border-t border-white/6">
            <div className="max-w-6xl mx-auto px-4">
                <Title
                    title="Contact"
                    heading="Get in touch with us"
                    description="Ready to upgrade your infrastructure? Reach out and let's discuss your project."
                />

                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ x: -60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                    >
                        <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                        <div className="space-y-5 mb-8">
                            {contactInfo.map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/6 hover:border-white/15 transition">
                                    <div className="w-10 h-10 rounded-lg bg-blue-900/20 flex items-center justify-center shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-white">{item.label}</div>
                                        {item.href ? (
                                            <a href={item.href} className="text-sm text-gray-400 hover:text-blue-400 transition">{item.value}</a>
                                        ) : (
                                            <div className="text-sm text-gray-400">{item.value}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 rounded-xl bg-white/3 border border-white/6">
                            <div className="text-sm font-semibold text-white mb-2">Business Hours</div>
                            <div className="text-sm text-gray-400">
                                Mon – Sat: 9:00 AM – 7:00 PM<br />
                                Sunday: Closed
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ x: 60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                    >
                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-10 rounded-2xl bg-white/3 border border-white/6">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                    <CheckCircleIcon className="size-8 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                                <p className="text-gray-400">{statusMessage}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-2xl bg-white/3 border border-white/6" id="contact-form">
                                <h3 className="text-xl font-semibold mb-2">Send us a message</h3>

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                                        <AlertCircleIcon className="size-4 shrink-0" />
                                        {statusMessage}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-300 mb-1 block">Name <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-300 mb-1 block">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 XXXXX-XXXXX"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 mb-1 block">Email <span className="text-red-400">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 mb-1 block">Subject <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="problem"
                                        value={formData.problem}
                                        onChange={handleChange}
                                        required
                                        placeholder="What do you need help with?"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300 mb-1 block">Message <span className="text-red-400">*</span></label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        placeholder="Tell us about your project..."
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition text-sm resize-none"
                                    ></textarea>
                                </div>
                                <PrimaryButton type="submit" className="w-full py-3" disabled={status === 'loading'}>
                                    {status === 'loading' ? (
                                        <>
                                            <LoaderIcon className="size-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <SendIcon className="size-4" />
                                        </>
                                    )}
                                </PrimaryButton>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
