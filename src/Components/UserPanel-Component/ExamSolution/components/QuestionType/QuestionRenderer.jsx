import MultipleChoiceQuestion from "../QuestionType/MultipleChoiceQuestion";
import MultipleSelectQuestion from "../QuestionType/MultipleSelectQuestion";
import FillInBlankQuestion from "../QuestionType/FillInBlankQuestion";
import DropdownQuestion from "../QuestionType/DropdownQuestion";
import EssayQuestion from "../QuestionType/EssayQuestion";
import SpeakingQuestion from "../QuestionType/SpeakingQuestion";

const QuestionRenderer = ({ question, onAnswer, userAnswer, theme, examResultId }) => {
    const questionTypeComponents = {
        1: MultipleChoiceQuestion,
        2: MultipleSelectQuestion,
        3: FillInBlankQuestion,
        4: FillInBlankQuestion,
        5: DropdownQuestion,
        6: EssayQuestion,
        7: SpeakingQuestion,
    };

    const QuestionComponent = questionTypeComponents[question.question_type_id] || FillInBlankQuestion;

    return (
        <QuestionComponent
            question={question}
            onAnswer={onAnswer}
            userAnswer={userAnswer}
            theme={theme}
            examResultId={examResultId}
        />
    );
};

export default QuestionRenderer;
