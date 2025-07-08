import { useState } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { FiTrash2 } from "react-icons/fi";
import { $api } from "../../../../../../../../utils";
import { Alert } from "../../../../../../../../utils/Alert";

export default function AnswerDelete({ answerId, refresh }) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen((prev) => !prev);

    const deletePart = async () => {
        try {
            await $api.delete(`/study-center/answers/${answerId}`);
            Alert("Javob muvaffaqiyatli o'chirildi", "success");
            handleOpen();
            if (refresh) refresh();
        } catch (error) {
            Alert("O'chirishda xatolik yuz berdi", "error");
            console.error("Error deleting part:", error);
        }
    };

    return (
        <>
            <Button
                size="sm"
                color="red"
                variant="gradient"
                className="flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
                onClick={(e) => {
                    handleOpen();
                }}
            >
                <FiTrash2 className="w-4 h-4" />
                O'chirish
            </Button>
            <Dialog open={open} handler={handleOpen} size="sm" className="rounded-xl">
                <DialogHeader>
                    <div className="flex items-center justify-center w-full gap-2 text-red-600">
                        Javobni o'chirish
                    </div>
                </DialogHeader>
                <DialogBody>
                    <div className="flex flex-col items-center text-center">
                        <span className="text-lg font-semibold text-gray-800 mb-2">
                            Diqqat!
                        </span>
                        <p className="text-gray-700">
                            Ushbu javobni o'chirmoqchimisiz? Ushbu amalni qaytarib bo'lmaydi.
                        </p>
                    </div>
                </DialogBody>
                <DialogFooter className="flex justify-center gap-2">
                    <Button variant="text" color="gray" onClick={handleOpen}>
                        Bekor qilish
                    </Button>
                    <Button color="red" variant="gradient" onClick={deletePart}>
                        Ha, o'chirish
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}