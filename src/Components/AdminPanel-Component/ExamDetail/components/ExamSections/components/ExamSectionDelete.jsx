import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
} from "@material-tailwind/react";
import { useState } from "react";
import { $api } from "../../../../../../utils";
import { Alert } from "../../../../../../utils/Alert";

export default function ExamSectionDelete({ id, refresh }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleConfirm = async () => {
        try {
            const response = await $api.delete(`/study-center/sections/${id}`)
            Alert("Muvaffaqiyatli", "success");
            refresh()
            setOpen(false)
        } catch (error) {
            console.log(error)
            Alert("Xatolik yuz berdi", "error");
        }
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                color="red"
                className="flex items-center gap-2"
            >
                O'chirish
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader className="text-red-600">
                    Diqqat! Bo‘limni o‘chirmoqchimisiz?
                </DialogHeader>
                <DialogBody>
                    Ushbu bo‘limni o‘chirsangiz, barcha ma’lumotlar bekor qilinadi.
                    Ishonchingiz komilmi?
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="blue-gray" onClick={handleOpen}>
                        Bekor qilish
                    </Button>
                    <Button variant="gradient" color="red" onClick={handleConfirm}>
                        Ha, o‘chirish
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
