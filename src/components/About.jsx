import { motion } from 'framer-motion';
import Title from './Title';
import { CheckCircleIcon } from 'lucide-react';

const highlights = [
    'Emergency rapid-response support',
    '5+ years experienced staff',
    'Advanced technology solutions',
    'End-to-end project delivery',
    'Banking infrastructure specialists',
    'Solar & sustainable energy services',
];

export default function About() {
    return (
        <section id="about" className="py-20 bg-white/3 border-t border-white/6">
            <div className="max-w-6xl mx-auto px-4">
                <Title
                    title="About Us"
                    heading="15+ years of building trust & excellence"
                    description="Founded with a vision to revolutionize digital services for the banking and infrastructure industry."
                />

                <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                    {/* Image side */}
                    <motion.div
                        className="relative"
                        initial={{ x: -60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                    >
                        <div className="rounded-2xl overflow-hidden border border-white/6">
                            <img
                                src="/Image/Services/bank.jpg"
                                alt="Our Work"
                                className="w-full h-80 object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-5 -right-5 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl px-6 py-4 text-center shadow-lg">
                            <div className="text-3xl font-extrabold">15+</div>
                            <div className="text-xs opacity-90">Years of<br />Excellence</div>
                        </div>
                    </motion.div>

                    {/* Content side */}
                    <motion.div
                        initial={{ x: 60, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                    >
                        <p className="text-gray-300 leading-relaxed mb-6">
                            Digital Services was founded with a simple mission — to bridge the gap between
                            traditional banking infrastructure and modern technology. What started as a small
                            networking service company has grown into a full-fledged digital solutions provider.
                        </p>
                        <p className="text-gray-300 leading-relaxed mb-8">
                            We specialize in internet services, fiber laying, security solutions, bank renovation,
                            ATM installation, and solar distribution. Our expertise ensures that businesses stay
                            ahead with reliable and future-ready infrastructure.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {highlights.map((item, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-center gap-2 text-sm text-gray-200"
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.05 }}
                                >
                                    <CheckCircleIcon className="size-4 text-blue-400 flex-shrink-0" />
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
