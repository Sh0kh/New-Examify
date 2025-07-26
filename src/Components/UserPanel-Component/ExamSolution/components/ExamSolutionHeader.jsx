import { Switch, Typography } from "@material-tailwind/react";

export default function ExamSolutionHeader({
    examData,
    timeLeft,
    activeOutModal,
    nextSection,
    setTheme,
    theme,
    time
}) {
    const loading = false;


    const toggleFullscreen = () => {
        const elem = document.documentElement;
        if (!document.fullscreenElement) {
            elem.requestFullscreen().catch((err) => {
                console.error(`Ошибка при включении fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="Book__header fixed w-full z-50 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Заголовок и переключатель темы */}
                <div className="flex items-center gap-4">
                    <h2 className="text-black dark:text-white text-2xl font-bold">
                        {examData?.section?.name || examData?.next_section?.name}
                    </h2>
                    <div className="w-[2px] h-[40px] bg-black dark:bg-white"></div>

                    {/* Переключатель темы */}
                    <div className="flex items-center gap-2">
                        <Typography className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {theme ? "🌙 Dark" : "🌞 Light"}
                        </Typography>
                        <Switch
                            checked={theme}
                            onChange={(e) => setTheme(e.target.checked)}
                            className="bg-gray-300 checked:bg-blue-600"
                            circleProps={{ className: "shadow-md" }}
                        />
                    </div>
                </div>

                {/* Таймер и уведомление при малом времени */}
                <div className="flex flex-col items-end">
                    <h2 className="text-lg font-medium text-red-600">{timeLeft}</h2>
                    {time < 60 && (
                        <span className="text-xs text-orange-500 font-semibold animate-pulse">
                            ⏳ Less than 1 minute left!
                        </span>
                    )}
                </div>

                {/* Кнопки управления */}
                <div className="flex items-center gap-3 flex-wrap">
                    <button
                        onClick={toggleFullscreen}
                        className="bg-white dark:bg-gray-900 text-base shadow-sm px-4 py-3 font-semibold rounded-lg text-gray-700 dark:text-gray-200 transition duration-500 border border-gray-300 dark:border-gray-600 hover:opacity-70"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19H8q.425 0 .713.288T9 20t-.288.713T8 21H4q-.425 0-.712-.288T3 20v-4q0-.425.288-.712T4 15t.713.288T5 16v1.6l2.4-2.4q.275-.275.7-.275t.7.275t.275.7t-.275.7zm11.2 0l-2.4-2.4q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l2.4 2.4V16q0-.425.288-.712T20 15t.713.288T21 16v4q0 .425-.288.713T20 21h-4q-.425 0-.712-.288T15 20t.288-.712T16 19zM5 6.4V8q0 .425-.288.713T4 9t-.712-.288T3 8V4q0-.425.288-.712T4 3h4q.425 0 .713.288T9 4t-.288.713T8 5H6.4l2.4 2.4q.275.275.275.7t-.275.7t-.7.275t-.7-.275zm14 0l-2.4 2.4q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7L17.6 5H16q-.425 0-.712-.287T15 4t.288-.712T16 3h4q.425 0 .713.288T21 4v4q0 .425-.288.713T20 9t-.712-.288T19 8z"></path></svg>
                    </button>

                    <button
                        onClick={activeOutModal}
                        className="bg-white dark:bg-gray-900 text-base shadow-sm px-6 py-2 font-semibold rounded-lg text-gray-700 dark:text-gray-200 transition duration-500 border border-gray-300 dark:border-gray-600 hover:opacity-70"
                    >
                        Leave exam
                    </button>

                    <button
                        onClick={nextSection}
                        disabled={loading}
                        className={`bg-blue-600 text-white px-6 py-2 font-bold rounded-lg shadow-sm transition duration-500 border-2 border-blue-600
                            ${loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-transparent hover:text-blue-600"
                            }`}
                    >
                        {examData?.remaining_sections === 0 ? "Finish exam" : 'Next exam'}
                    </button>
                </div>
            </div>
        </div>
    );
}
