import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react";
import { $api } from "../../../../utils";
import { Alert } from "../../../../utils/Alert";

export default function PriceEditModal({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(data?.min_price || "");
    const [maxPrice, setMaxPrice] = useState(data?.max_price || "");
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const formatNumberWithSpace = (value) => {
        const num = value.toString().replace(/\D/g, "");
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const unformatNumber = (value) => {
        return value.toString().replace(/\s/g, "");
    };

    const EditPrice = async () => {
        setLoading(true);
        try {
            const EditData = {
                min_price: unformatNumber(minPrice), // string ko‘rinishda
                max_price: unformatNumber(maxPrice), // string ko‘rinishda
            };
            await $api.post(`/admin/update-exam-price`, EditData);
            Alert("Muvaffaqiyatli qo'shildi", "success");
            setOpen(false);
            refresh?.();
        } catch (error) {
            console.log(error);
            Alert(`Xatolik: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={handleOpen} color="blue">
                Narxni sozlash
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Narx oralig'ini kiriting</DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Minimal summa (so'm)"
                        type="text"
                        value={formatNumberWithSpace(minPrice)}
                        onChange={(e) => setMinPrice(unformatNumber(e.target.value))}
                        crossOrigin=""
                    />
                    <Input
                        label="Maksimal summa (so'm)"
                        type="text"
                        value={formatNumberWithSpace(maxPrice)}
                        onChange={(e) => setMaxPrice(unformatNumber(e.target.value))}
                        crossOrigin=""
                    />
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={handleOpen} disabled={loading}>
                        Bekor qilish
                    </Button>
                    <Button
                        variant="gradient"
                        color="blue"
                        onClick={EditPrice}
                        disabled={loading}
                    >
                        {loading ? "Yuklanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
