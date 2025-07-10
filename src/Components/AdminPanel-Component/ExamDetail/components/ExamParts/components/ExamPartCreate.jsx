import React, { useState, useRef } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Switch,
} from "@material-tailwind/react";
import { $api } from "../../../../../../utils";
import { Alert } from "../../../../../../utils/Alert";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function ExamPartCreate({ refresh }) {
    const { sectionID } = useParams();
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        exam_section_id: sectionID,
        name: "",
        description: "",
        rules: "",
        duration: "",
        total_questions: "",
        status: true,
        type: "",
        video_frame: "",
        audio: null,
        order: ''
    });

    const [previewAudio, setPreviewAudio] = useState(null);
    const audioInputRef = useRef(null);

    const handleOpen = () => setOpen(!open);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedMimeTypes = [
                'audio/mp3',
                'audio/mpeg',
                'audio/wav',
                'audio/x-wav',
                'audio/m4a',
                'audio/mp4',
                'audio/x-m4a'  // Добавлен дополнительный MIME тип для m4a
            ];
            const allowedExtensions = ['.mp3', '.wav', '.m4a'];
            const fileName = file.name.toLowerCase();
            const isValidMime = allowedMimeTypes.includes(file.type);
            const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

            // Упрощенная проверка - проверяем только расширение файла
            // так как MIME типы могут отличаться в разных браузерах
            if (!hasValidExtension) {
                Alert("Audio fayl faqat mp3, wav yoki m4a formatida bo'lishi kerak", "error");
                e.target.value = '';
                return;
            }

            // Дополнительная проверка размера файла (например, максимум 50MB)
            const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
            if (file.size > maxSizeInBytes) {
                Alert("Audio fayl hajmi 50MB dan oshmasligi kerak", "error");
                e.target.value = '';
                return;
            }

            setFormData((prev) => ({ ...prev, audio: file }));
            setPreviewAudio(URL.createObjectURL(file));

            console.log('Selected audio file:', {
                name: file.name,
                type: file.type,
                size: file.size
            });
        }
    };

    const removeAudio = () => {
        setFormData((prev) => ({ ...prev, audio: null }));
        setPreviewAudio(null);
        if (audioInputRef.current) audioInputRef.current.value = '';
    };

    const handleAudioUpload = () => {
        audioInputRef.current?.click();
    };

    const handleCreate = async () => {
        try {
            const data = new FormData();
            for (const key in formData) {
                if (key === "audio" && formData.audio) {
                    data.append("audio", formData.audio);
                } else if (key === "status") {
                    data.append("status", formData.status ? 1 : 0);
                } else if (key !== "audio") {
                    data.append(key, formData[key]);
                }
            }
            await $api.post("/study-center/parts", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            refresh();
            Alert("Part muvaffaqiyatli qo‘shildi", "success");
            handleOpen();
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Noma'lum xatolik";
            Alert(`Xatolik: ${errorMessage}`, "error");
        }
    };

    return (
        <>
            <Button color="blue" onClick={handleOpen}>
                Create Part
            </Button>
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>Create Exam Part</DialogHeader>
                <DialogBody className="max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        {/* Description - ReactQuill */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">Description</label>
                            <ReactQuill
                                className="h-[100px] mb-[50px]"
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                            />
                        </div>

                        {/* Rules - ReactQuill */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">Rules</label>
                            <ReactQuill
                                className="h-[100px] mb-[50px]"
                                theme="snow"
                                value={formData.rules}
                                onChange={(value) => setFormData(prev => ({ ...prev, rules: value }))}
                            />
                        </div>

                        {/* <Input
                            label="Duration (e.g. 20:00)"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                        /> */}
                        <Input
                            label="Total Questions"
                            name="total_questions"
                            type="number"
                            value={formData.total_questions}
                            onChange={handleChange}
                        />
                        <Input
                            label="Tartib raqami"
                            name="order"
                            type="number"
                            value={formData.order}
                            onChange={handleChange}
                        />
                        <Input
                            label="Type (e.g. reading)"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        />
                        <Input
                            label="Video Frame (YouTube embed URL)"
                            name="video_frame"
                            value={formData.video_frame}
                            onChange={handleChange}
                        />

                        <div className="flex items-center gap-4">
                            <span>Status:</span>
                            <Switch
                                checked={formData.status}
                                onChange={() =>
                                    setFormData((prev) => ({ ...prev, status: !prev.status }))
                                }
                            />
                            <span>{formData.status ? "Active" : "Inactive"}</span>
                        </div>

                        {/* Audio Upload */}
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                accept=".mp3,.wav,.m4a,audio/*"  // Добавлены конкретные расширения
                                id="audio-upload"
                                hidden
                                ref={audioInputRef}
                                onChange={handleAudioChange}
                            />
                            <Button
                                variant="outlined"
                                color="blue"
                                fullWidth
                                onClick={handleAudioUpload}
                            >
                                Upload Audio
                            </Button>
                            {previewAudio && (
                                <>
                                    <audio controls className="w-full">
                                        <source src={previewAudio} />
                                    </audio>
                                    <Button
                                        size="sm"
                                        color="red"
                                        onClick={removeAudio}
                                        className="mt-2"
                                    >
                                        Remove Audio
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleOpen}>
                        Cancel
                    </Button>
                    <Button color="green" onClick={handleCreate}>
                        Save
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
