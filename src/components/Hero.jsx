import { ArrowRightIcon, PlayIcon, ZapIcon, ShieldCheckIcon, PhoneIcon } from 'lucide-react';
import { PrimaryButton, GhostButton } from './Buttons';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function useCounter(target, duration, trigger) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!trigger) return;
        let start = 0;
        const step = Math.max(Math.floor(duration / target), 1);
        const id = setInterval(() => {
            start++;
            setVal(start);
            if (start >= target) clearInterval(id);
        }, step);
        return () => clearInterval(id);
    }, [trigger, target, duration]);
    return val;
}

export default function Hero() {
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);

    const exp = useCounter(15, 2000, statsVisible);
    const customers = useCounter(2000, 1, statsVisible);
    const atms = useCounter(150, 2000, statsVisible);
    const cable = useCounter(100, 2000, statsVisible);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setStatsVisible(true); obs.disconnect(); } },
            { threshold: 0.3 }
        );
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    const serviceImages = [
        '/Image/Services/Fiber.jpeg',
        '/Image/Services/router.jpg',
        '/Image/Services/camera.jpg',
    ];

    const trustedBy = [
        'Banking',
        'Networking',
        'Security',
        'Infrastructure',
        'Solar Energy'
    ];

    return (
        <>
            <section id="home" className="relative z-10">
                <div className="max-w-6xl mx-auto px-4 min-h-screen max-md:w-screen max-md:overflow-hidden pt-32 md:pt-26 flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div className="text-left">
                            <motion.div className="inline-flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full bg-white/10 mb-6 justify-start"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                            >
                                <div className="size-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <ZapIcon className="size-3 text-blue-400" />
                                </div>
                                <span className="text-xs text-gray-200/90">
                                    15+ Years of Trusted Excellence
                                </span>
                            </motion.div>

                            <motion.h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-xl"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                Better Faster <br />
                                <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-300 to-cyan-400">
                                    Secure Reliable
                                </span>
                            </motion.h1>

                            <motion.p className="text-gray-300 max-w-lg mb-8"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                            >
                                Empowering Banks with Innovative Renovation and Reliable Networking Solutions.
                                Transforming banking with modern infrastructure, ATM installations, and high-speed connectivity.
                            </motion.p>

                            <motion.div className="flex flex-col sm:flex-row items-center gap-4 mb-8"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.3 }}
                            >
                                <a href="#services" className="w-full sm:w-auto">
                                    <PrimaryButton className="max-sm:w-full py-3 px-7">
                                        Explore Services
                                        <ArrowRightIcon className="size-4" />
                                    </PrimaryButton>
                                </a>

                                <a href="#about">
                                    <GhostButton className="max-sm:w-full max-sm:justify-center py-3 px-5">
                                        <PlayIcon className="size-4" />
                                        Learn About Us
                                    </GhostButton>
                                </a>
                            </motion.div>

                            <motion.div className="flex sm:inline-flex overflow-hidden items-center max-sm:justify-center text-sm text-gray-200 bg-white/10 rounded"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                <div className="flex items-center gap-2 p-2 px-3 sm:px-6.5 hover:bg-white/3 transition-colors">
                                    <ZapIcon className="size-4 text-sky-500" />
                                    <div>
                                        <div>Emergency Support</div>
                                        <div className="text-xs text-gray-400">
                                            24/7 rapid response
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:block h-6 w-px bg-white/6" />

                                <div className="flex items-center gap-2 p-2 px-3 sm:px-6.5 hover:bg-white/3 transition-colors">
                                    <ShieldCheckIcon className="size-4 text-cyan-500" />
                                    <div>
                                        <div>Full-service delivery</div>
                                        <div className="text-xs text-gray-400">
                                            Install, maintain & support
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: mockup card with real service image */}
                        <motion.div className="mx-auto w-full max-w-lg"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.5 }}
                        >
                            <motion.div className="rounded-3xl overflow-hidden border border-white/6 shadow-2xl bg-linear-to-b from-black/50 to-transparent">
                                <div className="relative aspect-16/10 bg-gray-900">
                                    <img
                                        src="/Image/Background/background1.jpg"
                                        alt="Digital Services Work"
                                        className="w-full h-full object-cover object-center"
                                    />

                                    <div className="absolute left-4 top-4 px-3 py-1 rounded-full bg-black/15 backdrop-blur-sm text-xs">
                                        Fiber • Networking • Renovation
                                    </div>

                                    <div className="absolute right-4 bottom-4">
                                        <a href="#services" className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/6 backdrop-blur-sm hover:bg-white/10 transition focus:outline-none">
                                            <PlayIcon className="size-4" />
                                            <span className="text-xs">View services</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="mt-4 flex gap-3 items-center justify-start">
                                {serviceImages.map((src, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                                        className="w-14 h-10 rounded-lg overflow-hidden border border-white/6"
                                    >
                                        <img
                                            src={src}
                                            alt="service-thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                ))}
                                <motion.div className="text-sm text-gray-400 ml-2 flex items-center gap-2"
                                    initial={{ y: 60, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                                >
                                    <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping duration-300" />
                                        <span className="relative inline-flex size-2 rounded-full bg-green-600" />
                                    </div>
                                    500+ completed projects
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* STATS MARQUEE */}
            <motion.section className="border-y border-white/6 bg-white/1 max-md:mt-10"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <div className="max-w-6xl mx-auto px-6" ref={statsRef}>
                    <div className="w-full py-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-white">{exp}+</div>
                                <div className="text-sm text-gray-400 mt-1">Years in Business</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-white">{customers}+</div>
                                <div className="text-sm text-gray-400 mt-1">Happy Customers</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-white">{atms}+</div>
                                <div className="text-sm text-gray-400 mt-1">ATMs Installed</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold text-white">{cable}Km+</div>
                                <div className="text-sm text-gray-400 mt-1">Cable Laid</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* CATEGORY MARQUEE */}
            <motion.section className="border-b border-white/6 bg-white/1"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <div className="max-w-6xl mx-auto px-6">
                    <div className="w-full overflow-hidden py-6">
                        <div className="flex gap-14 items-center justify-center animate-marquee whitespace-nowrap">
                            {trustedBy.concat(trustedBy).map((logo, i) => (
                                <span
                                    key={i}
                                    className="mx-6 text-sm md:text-base font-semibold text-gray-400 hover:text-gray-300 tracking-wide transition-colors"
                                >
                                    {logo}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>
        </>
    );
}
