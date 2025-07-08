import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { $api } from "../../../../../../../../utils";
import { Alert } from "../../../../../../../../utils/Alert";

export default function DeleteQuestion({ questionId, refresh }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleDelete = async () => {
        try {
            await $api.delete(`/study-center/questions/${questionId}`)
            Alert("Muvaffaqiyatli", "success");
            setOpen(false)
            refresh()
        } catch (error) {
            Alert(`Xatolik: ${error}`, "error");
        }
    };

    return (
        <>
            <Button
                color="red"
                onClick={handleOpen}
                className="flex items-center gap-2 px-[20px] py-[5px]"
            >
                <TrashIcon className="h-5 w-5" />
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Diqqat!</DialogHeader>
                <DialogBody divider>
                    <Typography color="gray" className="font-normal">
                        Siz rostdan ham bu savolni o‘chirib tashlamoqchimisiz? Bu amal ortga qaytarilmaydi.
                    </Typography>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={handleOpen} className="mr-2">
                        <span>Bekor qilish</span>
                    </Button>
                    <Button color="red" onClick={handleDelete}>
                        <span>O‘chirish</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
