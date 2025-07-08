import { useEffect, useState, useRef } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Typography,
    Select,
    Option,
    Input,
    Spinner
} from "@material-tailwind/react";
import { $api } from "../../../../../../../../utils";
import { Alert } from "../../../../../../../../utils/Alert";
import { useParams, useNavigate } from "react-router-dom";
import RichText from "../../../../../../../UI/RichText/RichText";

export default function QuestionCreatePage({ refresh, getPartById }) {
    const [questionTypesData, setQuestionTypesData] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { partID } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        question_type_id: null,
        question_text: "",
        image: null,
        audio: null,
        order: 1,
    });

    const getQuestionType = async () => {
        setIsLoading(true);
        try {
            const response = await $api.get("/study-center/question-types");
            setQuestionTypesData(response?.data?.types || []);
        } catch (error) {
            console.log("Error fetching question types:", error);
            Alert("Savol turlarini yuklashda xatolik", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files && files.length > 0 ? files[0] : value,
        }));
    };

    const handleSelect = (value) => {
        if (!value) return;
        setSelectedTypeId(value);
        setForm((prev) => ({
            ...prev,
            question_type_id: parseInt(value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("exam_part_id", partID);
            formData.append("question_type_id", form.question_type_id);
            formData.append("question_text", form.question_text);
            formData.append("order", form.order);
            if (form.image) formData.append("image", form.image);
            if (form.audio) formData.append("audio", form.audio);

            await $api.post("/study-center/questions", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            refresh?.();
            getPartById?.();
            Alert("Savol muvaffaqiyatli qo'shildi", "success");
            navigate(-1);
        } catch (error) {
            console.error("Error creating question:", error);
            Alert("Xatolik yuz berdi", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        getQuestionType();
    }, []);

    return (
        <div className="p-6 mx-auto">
            <Card shadow={true}>
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <Typography variant="h5" color="blue-gray">
                        Yangi Savol Yaratish
                    </Typography>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardBody className="space-y-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Spinner className="h-12 w-12" />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Savol matni</label>
                                    <RichText
                                        content={form.question_text}
                                        onChange={(newContent) => setForm((prev) => ({ ...prev, question_text: newContent }))}
                                        height={400}
                                        menubar={false}
                                    />
                                </div>
                                <p></p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Select
                                            label="Savol turi"
                                            value={selectedTypeId}
                                            onChange={handleSelect}
                                            required
                                            error={!selectedTypeId}
                                            disabled={isLoading}
                                        >
                                            {questionTypesData.length > 0 ? (
                                                questionTypesData.map((type) => (
                                                    <Option key={type.id} value={String(type.id)}>
                                                        {type.name}
                                                    </Option>
                                                ))
                                            ) : (
                                                <Option value="" disabled>
                                                    Yuklanmoqda...
                                                </Option>
                                            )}
                                        </Select>
                                    </div>

                                    <Input
                                        label="Tartib raqami"
                                        name="order"
                                        type="number"
                                        min="1"
                                        value={form.order}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
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
                                            disabled={isLoading}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={() => document.getElementById("image-upload").click()}
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            {form.image ? form.image.name : "Rasm tanlash"}
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
                                            disabled={isLoading}
                                        />
                                        <Button
                                            variant="outlined"
                                            onClick={() => document.getElementById("audio-upload").click()}
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            {form.audio ? form.audio.name : "Audio tanlash"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <Button
                                        variant="text"
                                        color="red"
                                        onClick={() => navigate(-1)}
                                        disabled={isSubmitting}
                                    >
                                        Bekor qilish
                                    </Button>
                                    <Button
                                        color="blue"
                                        type="submit"
                                        disabled={isSubmitting || isLoading}
                                        className="flex items-center gap-2"
                                    >
                                        {isSubmitting && <Spinner className="h-4 w-4" />}
                                        Saqlash
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardBody>
                </form>
            </Card>
        </div>
    );
}