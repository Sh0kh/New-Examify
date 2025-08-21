import CONFIG from '../../../../../utils/Config';
import parse from "html-react-parser";

export default function FillInBlankQuestion({ question, onAnswer, userAnswer, theme }) {
    const questionText = question.question_text || "";

    // Регулярка для {textinput} и {textinput(answer)}
    const inputRegex = /{textinput(?:\(([^)]*)\))?}/g;
    const inputMatches = [...questionText.matchAll(inputRegex)];
    const inputCount = inputMatches.length;

    // Ответы пользователя (оригинальные)
    const answers = Array.isArray(userAnswer) ? userAnswer : new Array(inputCount).fill("");

    // Функция для извлечения только текстового содержимого из HTML
    const extractTextContent = (htmlString) => {
        if (!htmlString) return '';

        // Если строка не содержит HTML тегов, возвращаем как есть
        if (!htmlString.includes('<')) return htmlString;

        try {
            let cleanText = htmlString;

            // Удаляем все HTML комментарии (включая Word комментарии)
            cleanText = cleanText.replace(/<!--[\s\S]*?-->/g, '');

            // Удаляем XML объявления, DOCTYPE и другие служебные теги
            cleanText = cleanText.replace(/<\?xml[\s\S]*?\?>/g, '');
            cleanText = cleanText.replace(/<!DOCTYPE[\s\S]*?>/g, '');
            cleanText = cleanText.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '');

            // Простое удаление всех HTML тегов регулярным выражением
            cleanText = cleanText.replace(/<[^>]*>/g, '');

            // Декодируем HTML сущности
            cleanText = cleanText
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&apos;/g, "'");

            // Удаляем лишние пробелы, табы, переносы строк
            cleanText = cleanText.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();

            return cleanText;
        } catch (error) {
            // Fallback: агрессивная очистка всех тегов
            console.warn('Error extracting text content:', error);
            const fallback = htmlString
                .replace(/<!--[\s\S]*?-->/g, '')  // Удаляем комментарии
                .replace(/<[^>]*>/g, '')          // Удаляем все теги
                .replace(/&[^;]+;/g, ' ')         // Удаляем HTML сущности
                .replace(/\s+/g, ' ')             // Сжимаем пробелы
                .trim();
            return fallback;
        }
    };

    // Правильные ответы (извлекаем только текст, без HTML тегов)
    const correctAnswers = inputMatches.map(match => {
        const rawAnswer = match[1]?.trim() || "";
        return extractTextContent(rawAnswer);
    });

    // Функция очистки строки от всего, кроме букв и цифр (только для сравнения)
    const cleanString = (str) =>
        str?.toLowerCase().replace(/[^a-z0-9а-яё]/gi, '') || '';

    const handleInputChange = (inputIndex, value) => {
        const newAnswers = [...answers];
        newAnswers[inputIndex] = value; // Сохраняем оригинальный ввод
        onAnswer(newAnswers); // Отправляем оригинальные данные на backend
    };

    // Заменить textinput на span с индексом
    let inputIndex = 0;
    const processedText = questionText.replace(inputRegex, () => {
        return `<span data-input-index="${inputIndex++}"></span>`;
    });

    const parsedContent = parse(processedText, {
        replace: (domNode) => {
            if (
                domNode.type === "tag" &&
                domNode.name === "span" &&
                domNode.attribs &&
                domNode.attribs['data-input-index']
            ) {
                const index = parseInt(domNode.attribs['data-input-index']);
                const userInputValue = answers[index] || "";
                const correctAnswer = correctAnswers[index];

                // Сравнение ТОЛЬКО для отображения (очищенные строки)
                const isCorrect = cleanString(userInputValue) === cleanString(correctAnswer);

                return (
                    <input
                        key={`input-${index}`}
                        type="text"
                        value={userInputValue} // Показываем оригинальный ввод
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