import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import Faq from "../components/Faq";
import Contact from "../components/Contact";
import CTA from "../components/CTA";

export default function Home() {
    return (
        <>
            <Hero />
            <Services />
            <About />
            <Faq />
            <Contact />
            <CTA />
        </>
    )
}
