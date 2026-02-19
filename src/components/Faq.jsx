import { ChevronDownIcon } from 'lucide-react';
import Title from './Title';
import { useRef } from 'react';
import { motion } from 'framer-motion';

const faqData = [
    {
        question: 'What services does Digital Services provide?',
        answer: 'We offer end-to-end infrastructure solutions including fiber optic laying, router setup, security camera installation, bank renovation, ATM installation, and solar energy distribution.'
    },
    {
        question: 'How long does a typical project take?',
        answer: 'Project timelines vary by scope. Router setups may take a day, while full bank renovations can take 2-6 weeks. We provide a clear timeline after the initial site assessment.'
    },
    {
        question: 'Do you provide emergency support?',
        answer: 'Yes. We offer 24/7 emergency support for critical infrastructure issues. Our rapid-response team is equipped to handle urgent networking and security problems.'
    },
    {
        question: 'Which areas do you serve?',
        answer: 'We primarily serve Bihar and surrounding regions, with our headquarters in Gaya. We also take on projects across India for banking and networking solutions.'
    },
    {
        question: 'Do you offer ongoing maintenance after installation?',
        answer: 'Absolutely. We offer maintenance, optimization and continuous support packages to ensure your infrastructure continues to perform reliably and securely.'
    },
    {
        question: 'How can I get a quote for my project?',
        answer: 'Simply fill out our contact form or call us at +91 99342-95957. We\'ll schedule a consultation, assess your needs, and provide a detailed proposal within 2-3 business days.'
    }
];

export default function Faq() {
    const refs = useRef([]);
    return (
        <section id="faq" className="py-20 2xl:py-32">
            <div className="max-w-3xl mx-auto px-4">

                <Title
                    title="FAQ"
                    heading="Frequently asked questions"
                    description="Everything you need to know about our services. If you have more questions, feel free to reach out."
                />

                <div className="space-y-3">
                    {faqData.map((faq, i) => (
                        <motion.details
                            ref={(el) => { refs.current[i] = el; }}
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            key={i}
                            onAnimationComplete={() => {
                                const card = refs.current[i];
                                if (card) {
                                    card.classList.add("transition", "duration-300");
                                }
                            }}
                            className="group bg-white/6 rounded-xl select-none"
                        >
                            <summary className="flex items-center justify-between p-4 cursor-pointer">
                                <h4 className="font-medium">{faq.question}</h4>
                                <ChevronDownIcon className="w-5 h-5 text-gray-300 group-open:rotate-180 transition-transform" />
                            </summary>
                            <p className="p-4 pt-0 text-sm text-gray-300 leading-relaxed">
                                {faq.answer}
                            </p>
                        </motion.details>
                    ))}
                </div>
            </div>
        </section>
    );
}
