import React, { useState, useRef } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
    Select,
    Option
} from "@material-tailwind/react";
import { $api } from "../../../../../../utils";
import { Alert } from "../../../../../../utils/Alert";

export default function ExamSectionEdit({ section, refresh }) {
    const [open, setOpen] = useState(false);
    const types = ["Listening", "Reading", "Speaking", "Writing"];

    const [formData, setFormData] = useState({
        id: section.id,
        name: section.name || "",
        type: section.type || "",
        duration: section.duration || "",
        description: section.description || "",
        video_frame: null,
        audio: null,
    });

    const [preview, setPreview] = useState({
        video_frame: section.video_url || null,
        audio: section.audio_url || null,
    });

    const videoInputRef = useRef(null);
    const audioInputRef = useRef(null);

    const handleOpen = () => setOpen(!open);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, [name]: file }));
            setPreview((prev) => ({
                ...prev,
                [name]: URL.createObjectURL(file),
            }));
        }
    };

    const removeFile = (field) => {
        setFormData((prev) => ({ ...prev, [field]: null }));
        setPreview((prev) => ({ ...prev, [field]: null }));
        if (field === 'video_frame' && videoInputRef.current) videoInputRef.current.value = '';
        if (field === 'audio' && audioInputRef.current) audioInputRef.current.value = '';
    };

    const handleVideoUpload = () => videoInputRef.current?.click();
    const handleAudioUpload = () => audioInputRef.current?.click();

    const handleUpdate = async () => {
        try {
            const data = new FormData();
            data.append('name', formData.name.trim());
            data.append('type', formData.type.trim());
            data.append('duration', formData.duration);
            data.append('description', formData.description.trim());
            if (formData.video_frame instanceof File) {
                data.append('video_frame', formData.video_frame, formData.video_frame.name);
            }
            if (formData.audio instanceof File) {
                data.append('audio', formData.audio, formData.audio.name);
            }

            await $api.patch(`/study-center/sections/${formData.id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            Alert("Muvaffaqiyatli yangilandi", "success");
            handleOpen();
            refresh();
        } catch (error) {
            console.error(error);
            Alert("Xatolik yuz berdi", "error");
        }
    };

    return (
        <>
            <Button onClick={handleOpen} color="amber">
                O'zgartirish
            </Button>

            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>Edit Exam Section</DialogHeader>
                <DialogBody className="max-h-[75vh] overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        <Input
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <Select
                            label="Type"
                            value={formData.type}
                            onChange={(val) => handleChange({ target: { name: "type", value: val } })}
                        >
                            {types.map((type) => (
                                <Option key={type} value={type}>
                                    {type}
                                </Option>
                            ))}
                        </Select>
                        <Input
                            label="Duration (minutes)"
                            name="duration"
                            type="number"
                            value={formData.duration}
                            onChange={handleChange}
                        />
                        <Textarea
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                        {/* Video */}
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                accept="video/*"
                                name="video_frame"
                                ref={videoInputRef}
                                hidden
                                onChange={handleFileChange}
                            />
                            <Button variant="outlined" color="blue" fullWidth onClick={handleVideoUpload}>
                                Upload Video
                            </Button>
                            {preview.video_frame && (
                                <>
                                    <video controls className="w-full rounded">
                                        <source src={preview.video_frame} />
                                    </video>
                                    <Button size="sm" color="red" onClick={() => removeFile("video_frame")}>
                                        Remove Video
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Audio */}
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                accept="audio/*"
                                name="audio"
                                ref={audioInputRef}
                                hidden
                                onChange={handleFileChange}
                            />
                            <Button variant="outlined" color="blue" fullWidth onClick={handleAudioUpload}>
                                Upload Audio
                            </Button>
                            {preview.audio && (
                                <>
                                    <audio controls className="w-full">
                                        <source src={preview.audio} />
                                    </audio>
                                    <Button size="sm" color="red" onClick={() => removeFile("audio")}>
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
                    <Button color="green" onClick={handleUpdate}>
                        Update
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
