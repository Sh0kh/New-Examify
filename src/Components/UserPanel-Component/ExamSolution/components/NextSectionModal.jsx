import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    IconButton
} from "@material-tailwind/react";
import { $api } from "../../../../utils";
import { Alert } from "../../../../utils/Alert";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NextSectionModal({ time, isOpen, onClose, answers, examData, setDataFromChild }) {
    const [loading, setLoading] = useState(false);
    const [resultId, setResultId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (examData?.exam_result?.id && !resultId) {
            setResultId(examData.exam_result.id);
        }
    }, [examData, resultId]);

    useEffect(() => {
        if (time === 0) {
            handleNextSection();
        }
    }, [time]);

    const handleNextSection = async () => {
        setLoading(true);
        try {
            const data = {
                section_id: examData?.section?.id || examData?.next_section?.id,
                exam_result_id: resultId,
                user_id: localStorage.getItem('user_id'),
                parts: answers
            };
            const response = await $api.post(`/user/check-section`, data);
            console.log(response?.data?.score);
            if (response?.data?.next_section === undefined || response?.data?.score || response?.data?.next_section === null) {
                navigate('/my-result');
            }
            setDataFromChild(response?.data);
            if (response?.data?.exam_result?.id) {
                setResultId(response.data.exam_result.id);
            }

            onClose();
        } catch (error) {
            console.log(error);
            Alert(`Xatolik: ${error}`, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="sm" className="rounded-lg">
            <DialogHeader className="justify-between">
                <span className="text-red-600 font-bold"></span>
                <IconButton className="text-[20px]" variant="text" color="blue-gray" onClick={onClose}>
                    ✖
                </IconButton>
            </DialogHeader>
            <DialogBody className="text-center">
                <h2 className="text-[20px]">
                    {examData?.remaining_sections === 0 ? "Do you really want to finish the exam?" : 'You definitely want to move to the next section?'}
                </h2>
            </DialogBody>
            <DialogFooter>
                <div className="flex items-center justify-between gap-2 w-full">
                    <Button color="blue" variant="outlined" onClick={onClose} fullWidth>
                        No
                    </Button>
                    <Button disabled={loading} onClick={handleNextSection} color="blue" fullWidth>
                        {loading ? 'Loading..' : 'Yes'}
                    </Button>
                </div>
            </DialogFooter>
        </Dialog>
    );
}
