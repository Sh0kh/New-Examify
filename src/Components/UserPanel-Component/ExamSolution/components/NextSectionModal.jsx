import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    IconButton
} from "@material-tailwind/react";
import { $api } from "../../../../utils";

export default function NextSectionModal({ isOpen, onClose, answers, examData }) {

    const handleNextSection = async () => {
        try {
            const data = {
                section_id: examData?.section?.id,
                exam_result_id: examData?.exam_result?.id,
                user_id: localStorage.getItem('user_id'),
                parts: answers
            }
            const response = await $api.post(`/user/check-section`, data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog
            open={isOpen}
            handler={onClose}
            size="sm"
            className="rounded-lg"
        >
            <DialogHeader className="justify-between">
                <span className="text-red-600 font-bold"></span>
                <IconButton className="text-[20px]" variant="text" color="blue-gray" onClick={onClose}>
                    ✖
                </IconButton>
            </DialogHeader>
            <DialogBody className="text-center">
                <h2 className="text-[20px]">
                    You definitely want to move to the next section?
                </h2>
            </DialogBody>
            <DialogFooter >
                <div className="flex items-center justify-between gap-2 w-full">
                    <Button color="blue" variant="outlined" onClick={onClose} fullWidth>
                        No
                    </Button>
                    <Button onClick={handleNextSection} color="blue" fullWidth>
                        Yes
                    </Button>
                </div>
            </DialogFooter>
        </Dialog>
    );
}
