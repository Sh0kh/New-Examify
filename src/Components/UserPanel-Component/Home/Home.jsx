
import ChatTeam from "./components/Sections/ChatTeam";
import FAQ from "./components/Sections/FAQ";
import Hero from "./components/Sections/Hero";
import ItliveInfo from "./components/Sections/ItliveInfo";
import Result from "./components/Sections/Result";
import Service from "./components/Sections/Service";

export default function Home() {
    return (
        <>
            <main>
                <Hero />
                <Service />
                <ItliveInfo />
                <Result />
                <FAQ />
                <ChatTeam />
            </main>
        </>
    );
}
