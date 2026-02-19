import { useRef } from 'react';
import { CableIcon, WifiIcon, CameraIcon, BuildingIcon, LandmarkIcon, SunIcon } from 'lucide-react';
import Title from './Title';
import { motion } from 'framer-motion';

const servicesData = [
    {
        icon: <CableIcon className="w-6 h-6" />,
        title: 'Fiber Laying',
        desc: 'We lay high-speed fiber optic cables for reliable and seamless connectivity, using advanced tools and techniques.',
        image: '/Image/Services/Fiber.jpeg',
    },
    {
        icon: <WifiIcon className="w-6 h-6" />,
        title: 'Router Setup',
        desc: 'Fast and secure router installation for reliable connectivity in homes and businesses.',
        image: '/Image/Services/router.jpg',
    },
    {
        icon: <CameraIcon className="w-6 h-6" />,
        title: 'Security Service',
        desc: 'Comprehensive camera installation services to strengthen your security system with 24/7 surveillance.',
        image: '/Image/Services/camera.jpg',
    },
    {
        icon: <BuildingIcon className="w-6 h-6" />,
        title: 'Bank Renovation',
        desc: 'Transforming banking spaces to modern, efficient, and customer-friendly designs.',
        image: '/Image/Services/bank.jpg',
    },
    {
        icon: <LandmarkIcon className="w-6 h-6" />,
        title: 'ATM Installation',
        desc: 'Secure and reliable ATM installation services for seamless banking experiences.',
        image: '/Image/Services/atm.jpg',
    },
    {
        icon: <SunIcon className="w-6 h-6" />,
        title: 'Solar Distribution',
        desc: 'Professional solar installation services for efficient and sustainable energy solutions.',
        image: '/Image/Services/solar.jpg',
    },
];

export default function Services() {
    const refs = useRef([]);
    return (
        <section id="services" className="py-20 2xl:py-32">
            <div className="max-w-6xl mx-auto px-4">

                <Title
                    title="Services"
                    heading="Everything your infrastructure needs"
                    description="From fiber laying to ATM installation, we deliver comprehensive banking and networking solutions."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {servicesData.map((service, i) => (
                        <motion.div
                            ref={(el) => { refs.current[i] = el; }}
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            key={i}
                            onAnimationComplete={() => {
                                const card = refs.current[i];
                                if (card) {
                                    card.classList.add("transition", "duration-300", "hover:border-white/15", "hover:-translate-y-1");
                                }
                            }}
                            className="rounded-2xl overflow-hidden bg-white/3 border border-white/6"
                        >
                            <div className="h-44 overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center mb-4 text-blue-400">
                                    {service.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {service.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
