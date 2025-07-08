import {
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";

export default function TkExamDetailsWriting() {
    const parts = [
        {
            title: "Part 1",
            question: `Some people believe that technology will replace teachers in the future. To what extent do you agree or disagree with this statement? Give examples and explain your point of view.`,
            answer: `I believe that technology cannot fully replace teachers because personal interaction plays an important role in education. While online courses can be helpful, teachers provide motivation, support, and a personalized approach.`,
        },
        {
            title: "Part 2",
            question: `In many countries, the crime rate is increasing. What do you think are the reasons for this? What measures can be taken to tackle the problem?`,
            answer: `The rise in crime may be linked to poverty, unemployment, and social inequality. To combat this, we need to invest in education, create job opportunities, and strengthen the justice system.`,
        },
    ];

    return (
        <div className="min-h-screen p-6 ">
            <Typography variant="h4" color="blue-gray" className="mb-6">
                 Writing Review
            </Typography>

            {parts.map((part, index) => (
                <Card
                    key={index}
                    className="mb-6 mx-auto shadow-md border border-blue-200 bg-white"
                >
                    <CardBody>
                        <Typography variant="h5" color="blue" className="mb-4">
                            {part.title}
                        </Typography>

                        <Typography color="gray" className="text-sm mb-3 font-medium">
                            Question:
                        </Typography>
                        <Typography color="gray" className="mb-4 leading-relaxed">
                            {part.question}
                        </Typography>

                        <Typography color="gray" className="text-sm mb-2 font-medium">
                            Student's Answer:
                        </Typography>
                        <Typography color="blue-gray" className="leading-relaxed">
                            {part.answer}
                        </Typography>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
