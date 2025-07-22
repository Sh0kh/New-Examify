import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Input,
    Textarea,
    Typography,
    Card,
    CardBody,
} from "@material-tailwind/react";
import { useState } from "react";
import { $api } from "../../../../utils";
import { Alert } from "../../../../utils/Alert";

export default function StudyCenterEditModal({ refresh, data }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(data?.name || "");
    const [phone, setPhone] = useState(data?.phone || "");
    const [email, setEmail] = useState(data?.email || "");
    const [address, setAddress] = useState(data?.address || "");
    const [info, setInfo] = useState(data?.description || "");







    const handleOpen = () => setOpen(!open);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("phone", `+998${phone}`);
            formData.append("email", email);
            formData.append("address", address);
            formData.append("description", info);
            const response = await $api.post(`/study-center/profile/update/${data?.id}`, formData)
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
            <Button onClick={handleOpen} color="blue">
                Tahrirlash
            </Button>

            <Dialog open={open} handler={handleOpen} size="lg">
                <DialogHeader>Study Center Tahrirlash</DialogHeader>
                <DialogBody divider className="max-h-[80vh] overflow-y-auto">
                    <Card className="shadow-none">
                        <CardBody className="p-0">
                            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                                <Input
                                    label="Nomi"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Telefon (998 XX XXX XX XX)"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    maxLength={9}
                                    required
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    label="Manzil"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                                <Textarea
                                    label="Qo‘shimcha ma’lumot"
                                    value={info}
                                    onChange={(e) => setInfo(e.target.value)}
                                />
                            </form>
                        </CardBody>
                    </Card>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="blue-gray" onClick={handleOpen}>
                        Bekor qilish
                    </Button>
                    <Button color="blue" onClick={handleSubmit}>
                        Saqlash
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
