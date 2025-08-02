import { useEffect } from "react";
import MyResultHero from "./Commponents/MyResultHero";

export default function MyResult() {
    useEffect(() => {
        // Отключить правую кнопку мыши
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // Отключить F12 и другие DevTools клавиши
        const handleKeyDown = (e) => {
            if (
                e.key === "F12" || // F12
                (e.ctrlKey && e.shiftKey && e.key === "I") || // Ctrl+Shift+I
                (e.ctrlKey && e.shiftKey && e.key === "J") || // Ctrl+Shift+J
                (e.ctrlKey && e.key === "U") // Ctrl+U (Просмотр исходного кода)
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <main>
            <MyResultHero />
        </main>
    );
}
