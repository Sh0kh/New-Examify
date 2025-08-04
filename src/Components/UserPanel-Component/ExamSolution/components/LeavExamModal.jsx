import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    IconButton
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function LeavExamModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    const out = () => {
        navigate(-1);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return (
        <Dialog open={isOpen} handler={onClose} className="max-w-sm mx-auto">
            <DialogHeader className="justify-between">
                <span className="text-red-600 font-bold"></span>
                <IconButton className="text-[20px]" variant="text" color="blue-gray" onClick={onClose}>
                    ✖
                </IconButton>
            </DialogHeader>
            <DialogBody className="text-center">
                <h2 className="text-[20px] text-[red]">
                    Are you sure you want to exit the exam?
                </h2>
            </DialogBody>
            <DialogFooter >
                <div className="flex items-center justify-between gap-2 w-full">
                    <Button color="blue" variant="outlined" onClick={onClose} fullWidth>
                        No
                    </Button>
                    <Button color="red" onClick={out} fullWidth>
                        Yes
                    </Button>
                </div>
            </DialogFooter>
        </Dialog>
    );
}
