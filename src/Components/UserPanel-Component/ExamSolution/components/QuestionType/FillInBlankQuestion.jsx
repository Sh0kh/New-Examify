import CONFIG from '../../../../../utils/Config';
import parse from "html-react-parser";

export default function FillInBlankQuestion({ question, onAnswer, userAnswer, theme }) {
    const questionText = question.question_text || "";

    // Обновленное регулярное выражение для поиска {textinput} и {textinput(answer)}
    const inputRegex = /{textinput(?:\([^)]*\))?}/g;
    const inputMatches = questionText.match(inputRegex) || [];
    const inputCount = inputMatches.length;

    // Создаем массив ответов для каждого input'а
    const answers = Array.isArray(userAnswer) ? userAnswer : new Array(inputCount).fill("");

    // Извлекаем правильные ответы из маркеров
    const correctAnswers = inputMatches.map(match => {
        const answerMatch = match.match(/{textinput\(([^)]*)\)}/);
        return answerMatch ? answerMatch[1].toLowerCase().replace(/\s+/g, '') : "";
    });

    const handleInputChange = (inputIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[inputIndex] = value;
        onAnswer(newAnswers);
    };

    // Предварительно заменяем все типы textinput на уникальные маркеры с индексами
    let inputIndex = 0;
    const processedText = questionText.replace(inputRegex, () => {
        return `<span data-input-index="${inputIndex++}"></span>`;
    });

    const parsedContent = parse(processedText, {
        replace: (domNode) => {
            // Обрабатываем наши маркеры input'ов
            if (domNode.type === "tag" && domNode.name === "span" && domNode.attribs && domNode.attribs['data-input-index']) {
                const index = parseInt(domNode.attribs['data-input-index']);
                const userInputValue = answers[index] || "";
                const correctAnswer = correctAnswers[index];

                // Проверяем правильность ответа (приводим к нижнему регистру и убираем пробелы)
                const isCorrect = correctAnswer &&
                    userInputValue.toLowerCase().replace(/\s+/g, '') === correctAnswer;

                return (
                    <input
                        key={`input-${index}`}
                        type="text"
                        value={userInputValue}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={`inline-block border rounded px-2 py-1 mx-2 min-w-[100px] ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300'
                            }`}
                    />
                );
            }
        },
    });

    return (
        <div className="space-y-4">
            <div className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {parsedContent}
            </div>
            {question.image_url && (
                <img
                    src={CONFIG.API_URL + question.image_url}
                    alt="Question visual"
                    className="max-w-[400px] h-auto rounded-lg border mb-4"
                />
            )}
        </div>
    );
}