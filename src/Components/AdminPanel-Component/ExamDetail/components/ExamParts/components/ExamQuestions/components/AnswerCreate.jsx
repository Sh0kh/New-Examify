import { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Checkbox } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { Alert } from "../../../../../../../../utils/Alert";
import { $api } from "../../../../../../../../utils";

export default function AnswerCreate({ refresh }) {
    const [open, setOpen] = useState(false);
    const { questionID } = useParams()
    const [form, setForm] = useState({
        answer_text: "",
        is_correct: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await $api.post("/study-center/answers", {
                question_id: questionID,
                answer_text: form.answer_text,
                is_correct: form.is_correct,
            });
            setOpen(false);
            setForm({ answer_text: "", is_correct: false });
            Alert("Muvaffaqiyatli qo'shildi", "success");
            refresh()
        } catch (error) {
            Alert("Xatolik yuz berdi", "error");
        }
    };

    return (
        <>
            <Button color="blue" onClick={() => setOpen(true)}>
                Variant yaratish
            </Button>
            <Dialog open={open} handler={setOpen}>
                <DialogHeader>Variant yaratish</DialogHeader>
                <form onSubmit={handleSubmit}>
                    <DialogBody className="flex flex-col gap-4">
                        <Input
                            label="Variant matni"
                            name="answer_text"
                            value={form.answer_text}
                            onChange={handleChange}
                            required
                        />
                        <Checkbox
                            label="To'g'ri javob"
                            name="is_correct"
                            checked={form.is_correct}
                            onChange={handleChange}
                        />
                    </DialogBody>
                    <DialogFooter>
                        <Button variant="text" color="red" onClick={() => setOpen(false)} className="mr-2">
                            Bekor qilish
                        </Button>
                        <Button color="blue" type="submit">
                            Saqlash
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </>
    );
}