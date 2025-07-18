import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import { useState, useRef } from "react";
import { PencilSquareIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { $api } from "../../../../utils";
import { Alert } from "../../../../utils/Alert";

export default function UserEdit({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: data?.name,
        surname: data?.surname,
        photo: '',
    });

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleOpen = () => setOpen(!open);

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("surname", form.surname);

        if (form.photo) {
            // добавляем фото как binary (файл автоматически отправляется как multipart/form-data)
            formData.append("photo", form.photo);
        }

        try {
            const response = await $api.post(`/user/profile/update`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            refresh()

            Alert("Muvaffaqiyatli yangilandi", "success");
            setOpen(false);
        } catch (error) {
            console.error(error);
            Alert(`Xatolik: ${error?.response?.data?.message || "Server xatosi"}`, "error");
        }
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                fullWidth
                color="blue"
                className="flex items-center justify-center gap-2"
            >
                <PencilSquareIcon className="h-5 w-5" />
                Edit Profile
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Edit Profile</DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />
                    <Input
                        label="Surname"
                        name="surname"
                        value={form.surname}
                        onChange={handleChange}
                    />

                    {/* Скрытый input для выбора фото */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                    />

                    {/* Кнопка для выбора фото */}
                    <Button
                        color="gray"
                        variant="outlined"
                        onClick={handlePhotoClick}
                        className="flex items-center gap-2"
                    >
                        <PhotoIcon className="h-5 w-5" />
                        {form.photo ? form.photo.name : "Upload Photo"}
                    </Button>
                </DialogBody>

                <DialogFooter>
                    <Button variant="text" color="gray" onClick={handleOpen}>
                        Cancel
                    </Button>
                    <Button
                        color="blue"
                        onClick={handleSubmit}
                        className="ml-2 flex items-center gap-2"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                        Save
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
