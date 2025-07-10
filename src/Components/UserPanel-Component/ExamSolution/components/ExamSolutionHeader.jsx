import { Switch, Typography } from "@material-tailwind/react";

export default function ExamSolutionHeader({
    examData,
    timeLeft,
    activeOutModal,
    nextSection,
    setTheme,
    theme,
}) {
    const loading = false;

    return (
        <div className="Book__header p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Заголовок и переключатель */}
                <div className="flex items-center gap-4">
                    <h2 className="text-black dark:text-white text-2xl font-bold">
                        {examData?.section?.name || examData?.next_section?.name} 
                    </h2>
                    <div className="w-[2px] h-[40px] bg-black dark:bg-white"></div>

                    {/* Тема */}
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

                {/* Таймер */}
                <h2 className="text-lg font-medium text-red-600">{timeLeft}</h2>

                {/* Кнопки */}
                <div className="flex items-center gap-3 flex-wrap">
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
                        {loading ? "Loading..." : "Next Section"}
                    </button>
                </div>
            </div>
        </div>
    );
}
