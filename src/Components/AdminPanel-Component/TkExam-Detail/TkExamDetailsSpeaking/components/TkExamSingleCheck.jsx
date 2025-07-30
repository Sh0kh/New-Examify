import { useState } from "react";
import {
    Typography,
    Card,
    CardBody,
    Input,
    Button,
    Alert
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { $api } from "../../../../../utils";

export default function TkExamSingleCheck() {
    const [score, setScore] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [warning, setWarning] = useState(false);
    const { tkExamId, sectionID } = useParams();
    const navigate = useNavigate();


    const handleSubmit = async () => {
        try {
            const newData = {
                exam_id: tkExamId,
                section_score_id: sectionID,
                score: parseInt(score) || 0
            }
            const response = await $api.post(`study-center/fast-check-section`, newData)
            navigate(-1)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="min-h-screen p-6 ">
            <Card className="w-full max-w-md shadow-xl">
                <CardBody className="w-full">
                    <Typography variant="h4" color="blue-gray" className="mb-4 text-center">
                        Yakuniy bahoni kiriting.
                    </Typography>
                    <Input
                        label="Ball (0 - 10)"
                        type="number"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        disabled={submitted}
                        className="mb-4"
                    />

                    <Button
                        className="mt-[10px]"
                        color="blue"
                        onClick={handleSubmit}
                        disabled={submitted}
                        fullWidth
                    >
                        {submitted ? "Ball qo‘yilgan" : "Bahoni yuborish"}
                    </Button>

                    {warning && (
                        <Alert color="red" className="mt-4">
                            Diqqat! Siz faqat bir marta ball qo‘yishingiz mumkin.
                        </Alert>
                    )}

                    {submitted && !warning && (
                        <Alert color="green" className="mt-4">
                            Rahmat! Sizning ballingiz: {score} (yakuniy)
                        </Alert>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
