import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
    Input,
} from "@material-tailwind/react";
import { useState } from "react";
import { $api } from "../../../../../../utils";
import { Alert } from "../../../../../../utils/Alert";

export default function CenterExamInfoModal({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const addAllowedKeys = async () => {
        if (!key || isNaN(key)) return;

        setLoading(true);
        try {
            await $api.post(`/admin/add-allowed-keys`, {
                exam_id: data?.id,
                allowed_keys_count: key,
            });
            setOpen(false); // Закрыть модалку после успешного запроса
            Alert("Muvaffaqiyatli", "success");
            refresh()
        } catch (error) {
            console.error(error);
            Alert(`Xatolik: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={handleOpen} color="blue" className="w-full">
                Ko‘proq ma’lumot
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm" className="rounded-xl">
                <DialogHeader>
                    <Typography variant="h5" color="blue-gray">
                        Keylar haqida ma'lumot
                    </Typography>
                </DialogHeader>

                <DialogBody divider className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <Typography className="text-sm text-gray-500">Yaratilgan keylar</Typography>
                            <Typography className="font-medium">{data.created_keys_count}</Typography>
                        </div>
                        <div>
                            <Typography className="text-sm text-gray-500">Ruxsat etilgan keylar</Typography>
                            <Typography className="font-medium">{data.allowed_keys_count}</Typography>
                        </div>
                        <div>
                            <Typography className="text-sm text-gray-500">Foydalanilgan keylar</Typography>
                            <Typography className="font-medium">{data.used_keys_count}</Typography>
                        </div>
                        <div>
                            <Input
                                label="Yangi ruxsat etilgan keylar soni"
                                type="number"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                size="lg"
                                color="blue"
                                crossOrigin=""
                            />
                        </div>
                    </div>
                </DialogBody>

                <DialogFooter className="flex justify-between">
                    <Button variant="text" color="red" onClick={handleOpen}>
                        Yopish
                    </Button>
                    <Button
                        color="green"
                        onClick={addAllowedKeys}
                        disabled={loading || !key}
                        className="flex items-center gap-2"
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                            </svg>
                        )}
                        Saqlash
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
