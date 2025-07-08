import { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Typography,
    Input,
} from "@material-tailwind/react";
import { $api } from "../../../../../../../../utils";
import { Alert } from "../../../../../../../../utils/Alert";
import { useParams, useNavigate } from "react-router-dom";
import RichBox from "../../../../../../../UI/RichText/RichText";

export default function QuestionEditPage({ refresh }) {
    const [form, setForm] = useState({
        question_text: "",
        image: null,
        audio: null,
        order: 1,
    });

    const [questionData, setQuestionData] = useState(null);
    const { questionID } = useParams(); // ← получить ID из URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await $api.get(`/study-center/questions/${questionID}`);
                setQuestionData(res.data);
                setForm({
                    question_text: res.data.question_text || "",
                    image: null,
                    audio: null,
                    order: res.data.order || 1,
                });
            } catch (error) {
                console.error("Xatolik savolni olishda:", error);
                Alert("Savolni olishda xatolik yuz berdi", "error");
            }
        };

        if (questionID) fetchQuestion();
    }, [questionID]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files && files.length > 0 ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("question_text", form.question_text);
            if (form.image) formData.append("image", form.image);
            if (form.audio) formData.append("audio", form.audio);

            await $api.patch(`/study-center/questions/${questionID}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            refresh?.();
            Alert("Savol muvaffaqiyatli tahrirlandi", "success");
            navigate(-1); // вернуться назад
        } catch (error) {
            console.error("Error updating question:", error);
            Alert("Xatolik yuz berdi", "error");
        }
    };

    return (
        <div className="p-6 mx-auto">
            <Card>
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <Typography variant="h5" color="blue-gray">
                        Savolni tahrirlash
                    </Typography>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardBody className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Savol matni</label>
                            <RichBox
                                value={form.question_text}
                                onChange={(newContent) => setForm((prev) => ({ ...prev, question_text: newContent }))}
                                height={400}
                                menubar={false}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    name="image"
                                    className="hidden"
                                    onChange={handleChange}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => document.getElementById("image-upload").click()}
                                    className="w-full"
                                >
                                    {form.image
                                        ? `Rasm tanlandi: ${form.image.name}`
                                        : questionData?.image_url
                                            ? `Joriy rasm: ${questionData.image_url.split("/").pop()}`
                                            : "Rasm tanlash"}
                                </Button>
                            </div>

                            <div>
                                <input
                                    id="audio-upload"
                                    type="file"
                                    accept="audio/*"
                                    name="audio"
                                    className="hidden"
                                    onChange={handleChange}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => document.getElementById("audio-upload").click()}
                                    className="w-full"
                                >
                                    {form.audio
                                        ? `Audio tanlandi: ${form.audio.name}`
                                        : questionData?.audio_url
                                            ? `Joriy audio: ${questionData.audio_url.split("/").pop()}`
                                            : "Audio tanlash"}
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button variant="text" color="red" onClick={() => navigate(-1)}>
                                Bekor qilish
                            </Button>
                            <Button color="blue" type="submit">
                                Saqlash
                            </Button>
                        </div>
                    </CardBody>
                </form>
            </Card>
        </div>
    );
}
