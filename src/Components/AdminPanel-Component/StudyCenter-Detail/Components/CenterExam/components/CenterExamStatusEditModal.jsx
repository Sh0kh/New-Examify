import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Select,
    Option,
} from "@material-tailwind/react";
import { useState } from "react";
import { $api } from "../../../../../../utils";
import { Alert } from "../../../../../../utils/Alert";

export default function CenterExamStatusEditModal({ type, examId, refresh, ExamData }) {
    const [status, setStatus] = useState(ExamData?.status || "active");
    const [allowed_keys_count, setallowed_keys_count] = useState('')
    const [keyPrice, setKeyPrice] = useState(ExamData?.key_price || '');
    const [isOpen, setOpen] = useState(false);

    const handleSave = async () => {
        try {
            const Data = {
                exam_id: examId,
                status: status,
                key_price: keyPrice,
                allowed_keys_count: Number(allowed_keys_count)
            }
            const response = await $api.patch(`/admin/change-exam-status`, Data)
            Alert("Muvaffaqiyatli", "success");
            refresh()
            setOpen(false);
        } catch (error) {
            console.log(error);
            Alert(`Xatolik: ${error.message}`, "error");
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="gradient"
                color="blue"
                className="mt-[10px]"
            >
                Statusni o'zgartirish
            </Button>

            <Dialog open={isOpen} handler={() => setOpen(false)} size="sm">
                <DialogHeader>Imtihon statusini o'zgartirish</DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <Select
                        label="Statusni tanlang"
                        value={status}
                        onChange={(val) => setStatus(val)}
                    >
                        <Option value="active">Faol</Option>
                        <Option value="inactive">Nofaol</Option>
                    </Select>

                    {type == 3 && (
                        <Input
                            label="Kalit narxi"
                            type="number"
                            value={keyPrice}
                            onChange={(e) => setKeyPrice(e.target.value)}
                        />
                    )}
                    {type == 3 && (
                        <Input
                            label="Kalitlar soni"
                            type="number"
                            value={allowed_keys_count}
                            onChange={(e) => setallowed_keys_count(e.target.value)}
                        />
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="gray"
                        onClick={() => setOpen(false)}
                        className="mr-2"
                    >
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
