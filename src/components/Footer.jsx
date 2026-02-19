import { motion } from 'framer-motion';

const footerLinks = [
    {
        title: "Services",
        links: [
            { name: "Fiber Laying", url: "#services" },
            { name: "Router Setup", url: "#services" },
            { name: "Security Service", url: "#services" },
            { name: "Bank Renovation", url: "#services" },
            { name: "ATM Installation", url: "#services" },
            { name: "Solar", url: "#services" },
        ]
    },
    {
        title: "Company",
        links: [
            { name: "Home", url: "#home" },
            { name: "About Us", url: "#about" },
            { name: "FAQ", url: "#faq" },
            { name: "Contact", url: "#contact" },
        ]
    },
    {
        title: "Connect",
        links: [
            { name: "📞 +91 99342-95957", url: "tel:+919934295957" },
            { name: "📧 info@digitalservices.com", url: "mailto:info@digitalservices.com" },
        ]
    }
];

export default function Footer() {
    return (
        <motion.footer className="bg-white/6 border-t border-white/6 pt-10 text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.5 }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-white/10">
                    <div>
                        <a href="#home" className="flex items-center gap-2">
                            <img src='/Image/Logo&#39;s/1.png' alt="Digital Services" className="h-8" />
                        </a>
                        <p className="max-w-[410px] mt-6 text-sm leading-relaxed">
                            We are a full-service digital infrastructure company specializing in banking renovations, networking solutions, ATM installation, and solar distribution. Serving businesses across Bihar and beyond.
                        </p>
                        <div className="mt-4 text-sm">
                            <p>📍 Noor Compound, Dak Bunglow Rd, Gaya, Bihar 823001</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-between w-full md:w-[55%] gap-5">
                        {footerLinks.map((section, index) => (
                            <div key={index}>
                                <h3 className="font-semibold text-base text-white md:mb-5 mb-2">
                                    {section.title}
                                </h3>
                                <ul className="text-sm space-y-1">
                                    {section.links.map((link, i) => (
                                        <li key={i}>
                                            <a
                                                href={link.url}
                                                className="hover:text-white transition"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="py-4 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()}{' '}
                    Digital Services. All rights reserved.
                </p>
            </div>
        </motion.footer>
    );
}
