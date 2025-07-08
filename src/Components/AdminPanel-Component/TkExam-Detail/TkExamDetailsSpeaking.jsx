import {
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";

export default function TkExamDetailsSpeaking() {
    const parts = [
        {
            title: "Part 1",
            audios: [
                "audio1.mp3",
                "audio2.mp3",
                "audio3.mp3",
            ],
        },
        {
            title: "Part 2",
            audios: [
                "audio4.mp3",
                "audio5.mp3",
                "audio6.mp3",
            ],
        },
        {
            title: "Part 3",
            audios: [
                "audio7.mp3",
                "audio8.mp3",
                "audio9.mp3",
            ],
        },
    ];

    return (
        <div className="min-h-screen p-6">
            <Typography variant="h4" color="blue-gray" className="mb-6 ">
                 Speaking Tekshirish
            </Typography>

            {parts.map((part, index) => (
                <Card key={index} className="mb-6 mx-auto shadow-md border border-blue-200 bg-white">
                    <CardBody>
                        <Typography variant="h5" color="blue" className="mb-4">
                            {part.title}
                        </Typography>

                        <div className="space-y-4">
                            {part.audios.map((audioSrc, i) => (
                                <div key={i}>
                                    <Typography color="gray" className="text-sm mb-1">
                                        Вопрос {i + 1}
                                    </Typography>
                                    <audio controls className="w-full">
                                        <source src={audioSrc} type="audio/mpeg" />
                                        Ваш браузер не поддерживает аудио.
                                    </audio>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}
