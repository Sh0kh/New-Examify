import CONFIG from "../../../../../utils/Config";
import parse from "html-react-parser";

export default function EssayQuestion({ question, onAnswer, userAnswer, theme }) {
    const handleTextChange = (e) => {
        onAnswer(e.target.value);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col space-y-3">
                <p
                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                    dangerouslySetInnerHTML={{ __html: question.question_text }}
                />
                {question.image_url && (
                    <img
                        src={CONFIG.API_URL + question.image_url}
                        alt="Question visual"
                        className="max-w-[400px] h-auto rounded-lg border"
                    />
                )}
            </div>
            <div className="mt-4">
                <textarea
                    value={userAnswer || ""}
                    onChange={handleTextChange}
                    rows={8}
                    className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300'
                        }`}
                    placeholder="Javobingizni yozing..."
                />
            </div>
        </div>
    );
}