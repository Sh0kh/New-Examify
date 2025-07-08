import React from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Input,
    Typography,
    Textarea,
} from "@material-tailwind/react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { $api } from "../../../utils";
import { Alert, commonAlert } from "../../../utils/Alert";

export default function StudyCenterCreate({ refresh }) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [info, setInfo] = React.useState("");
    const [file, setFile] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const createStudyCenter = async () => {
        // Валидация обязательных полей
        if (!name || !phone || !password || !email || !address) {
            Alert("Barcha majburiy maydonlarni to'ldiring", "error");
            return;
        }

        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert("Email formatini to'g'ri kiriting", "error");
            return;
        }

        // Валидация телефона
        if (phone.length !== 9) {
            Alert("Telefon raqam 9 ta raqamdan iborat bo'lishi kerak", "error");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("phone", `+998${phone}`);
            formData.append("password", password);
            formData.append("email", email);
            formData.append("address", address);
            formData.append("description", info);

            // Добавляем файл только если он выбран
            if (file) {
                formData.append("logo", file);
            }

            const response = await $api.post(`/admin/study-centers`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert("Muvaffaqiyatli qo'shildi", "success");

            refresh()
            setName("");
            setPhone("");
            setPassword("");
            setEmail("");
            setAddress("");
            setInfo("");
            setFile(null);
            setOpen(false);

        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Noma'lum xatolik";
            Alert(`Xatolik: ${errorMessage}`, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpen = () => setOpen(!open);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            // Проверяем тип файла
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(selectedFile.type)) {
                Alert("Faqat rasm fayllari (JPEG, PNG, GIF) yuklash mumkin", "error");
                return;
            }

            // Проверяем размер файла (максимум 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (selectedFile.size > maxSize) {
                Alert("Fayl hajmi 5MB dan oshmasligi kerak", "error");
                return;
            }

            setFile(selectedFile);
        }
    };

    const removeFile = () => {
        setFile(null);
        // Очищаем input
        const fileInput = document.getElementById("file-upload");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                className="bg-blue-600 text-white text-[15px] font-semibold normal-case px-[25px] py-[8px] rounded-[8px] hover:bg-blue-600 shadow-none"
            >
                Yaratish
            </Button>

            <Dialog
                open={open}
                handler={handleOpen}
                size="xl"
                className="p-6 max-h-[90vh] overflow-y-auto"
                style={{ zIndex: 9000 }}
            >
                <DialogHeader className="text-gray-800 font-bold text-xl">
                    Yangi o'quv markaz yaratish
                </DialogHeader>

                <DialogBody className="space-y-4">
                    <Typography variant="small" color="gray" className="mb-2">
                        Barcha majburiy maydonlarni to'ldiring va saqlang.
                    </Typography>

                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label="Markaz nomi *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            crossOrigin={undefined}
                            required
                        />

                        {/* Телефон с фиксированным +998 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Telefon raqam *
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                                <span className="text-gray-500 text-sm mr-2 select-none">+998</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "").slice(0, 9);
                                        setPhone(val);
                                    }}
                                    placeholder="901234567"
                                    className="outline-none flex-1 text-sm bg-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Пароль с глазом */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Parol *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[5px] text-gray-600"
                                >
                                    {showPassword ? (
                                        <VisibilityOff className="w-5 h-5" />
                                    ) : (
                                        <Visibility className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Input
                            label="E-Mail *"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            crossOrigin={undefined}
                            required
                        />
                        <Input
                            label="Manzil *"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            crossOrigin={undefined}
                            required
                        />
                        <Textarea
                            label="Malumot"
                            value={info}
                            onChange={(e) => setInfo(e.target.value)}
                            crossOrigin={undefined}
                        />

                        {/* Загрузка файла */}
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo yuklash
                            </label>
                            <div className="flex items-center gap-3 w-full">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    accept="image/*"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                                >
                                    <CloudUploadIcon style={{ fontSize: 18 }} />
                                    Fayl tanlash
                                </label>
                                {file && (
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-sm text-gray-700 truncate">
                                            {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                            {file && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Fayl hajmi: {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            )}
                        </div>
                    </div>
                </DialogBody>

                <DialogFooter className="flex justify-end gap-3">
                    <Button
                        variant="outlined"
                        color="blue-gray"
                        onClick={handleOpen}
                        disabled={isLoading}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        onClick={createStudyCenter}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? "Yaratilmoqda..." : "Yaratish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}