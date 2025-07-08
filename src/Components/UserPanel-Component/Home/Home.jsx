import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import ChatTeam from "./components/Sections/ChatTeam";
import FAQ from "./components/Sections/FAQ";
import Hero from "./components/Sections/Hero";
import ItliveInfo from "./components/Sections/ItliveInfo";
import Service from "./components/Sections/Service";

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Service />
                <ItliveInfo />
                <FAQ />
                <ChatTeam />
            </main>
            <Footer />
        </>
    );
}
