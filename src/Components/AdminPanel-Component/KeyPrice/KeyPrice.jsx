import { Button, Card, Typography } from "@material-tailwind/react";

export default function KeyPrice() {
    const keyPrice = 50000; // пример цены, можешь заменить на динамическую

    return (
        <div className="p-6  mx-auto">
            <div className="flex flex-col mb-[20px] sm:flex-row justify-between items-center gap-4">
                <Typography variant="h4" color="blue-gray" className="font-bold">
                    Narxlar Statistkasi
                </Typography>
                <Button
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition"
                >
                    Yangilash
                </Button>
            </div>
            <Card className="bg-blue-50 p-6 shadow-lg rounded-xl">
                <Typography variant="h6" color="blue" className="mb-2">
                    Narx
                </Typography>
                <Typography variant="h3" color="blue" className="font-bold mb-2">
                    {keyPrice.toLocaleString("uz-UZ")} so'm
                </Typography>
                <Typography variant="small" color="gray">
                    Bu narx 1 dona kalit uchun amal qiladi
                </Typography>
            </Card>
        </div>
    );
}
