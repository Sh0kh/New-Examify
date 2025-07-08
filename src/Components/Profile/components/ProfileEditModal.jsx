import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import { useState } from "react";
import { $api } from "../../../utils";
import { Alert } from "../../../utils/Alert";

export default function ProfileEditModal({ data }) {
    const [open, setOpen] = useState(false);
    const [userName, setUserName] = useState(data?.username || "");
    const [password, setPassword] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            const Data = {
                username: userName,

                password: password,
            };
            const response = await $api.put(`/admin/update-password`, Data)
            Alert("Muvaffaqiyatli", "success");
            setOpen(false);
        } catch (error) {
            console.error("Error saving profile:", error);
            Alert(`Xatolik: ${error.message}`, "error");
        }
    };

    return (
        <>
            <Button onClick={handleOpen} color="blue" fullWidth>
                Tahrirlash
            </Button>

            <Dialog open={open} handler={handleClose} size="sm">
                <DialogHeader>Profilni tahrirlash</DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Foydalanuvchi nomi"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <Input
                        label="Yangi parol"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Agar parolni o'zgartirmoqchi bo‘lsangiz"
                    />
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={handleClose} className="mr-2">
                        Bekor qilish
                    </Button>
                    <Button variant="gradient" color="blue" onClick={handleSave}>
                        Saqlash
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
