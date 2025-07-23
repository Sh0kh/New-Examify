import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Select, Option
} from "@material-tailwind/react";

import { $api } from "../../../../../../utils";
import { Alert } from "../../../../../../utils/Alert";
import { useParams } from "react-router-dom";

export default function ExamSectionsCreate({ refresh }) {
  const { examID } = useParams();
  const [open, setOpen] = useState(false);
  const types = ["Listening", "Reading", "Speaking", "Writing"];
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    exam_id: examID,
    name: "",
    type: "",
    duration: "",
    description: "",
    video_frame: null,
    audio: null,
  });
  const [preview, setPreview] = useState({
    video_frame: null,
    audio: null,
  });

  // Создаем refs для файловых инпутов
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

    // Очищаем значение инпута
    if (field === 'video_frame' && videoInputRef.current) {
      videoInputRef.current.value = '';
    }
    if (field === 'audio' && audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  // Функции для программного клика по инпутам
  const handleVideoUpload = () => {
    videoInputRef.current?.click();
  };

  const handleAudioUpload = () => {
    audioInputRef.current?.click();
  };

  const handleCreate = async () => {
    setLoading(true)
    try {
      const data = new FormData();

      // Добавляем текстовые поля (только если они не пустые)
      if (formData.exam_id) data.append('exam_id', formData.exam_id);
      if (formData.name.trim()) data.append('name', formData.name.trim());
      if (formData.type.trim()) data.append('type', formData.type.trim());
      if (formData.duration) data.append('duration', formData.duration);
      if (formData.description.trim()) data.append('description', formData.description.trim());

      // Добавляем файлы в бинарном формате
      if (formData.video_frame && formData.video_frame instanceof File) {
        data.append('video_frame', formData.video_frame, formData.video_frame.name);
      }
      if (formData.audio && formData.audio instanceof File) {
        data.append('audio', formData.audio, formData.audio.name);
      }

      // Отправляем запрос с правильными заголовками
      const response = await $api.post(`/study-center/sections`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },

        // Для отслеживания прогресса загрузки (опционально)
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      });
      refresh()
      Alert("Muvaffaqiyatli qo'shildi", "success");
      handleOpen();

      // Сбрасываем форму
      setFormData({
        exam_id: examID,
        name: "",
        type: "",
        duration: "",
        description: "",
        video_frame: null,
        audio: null,
      });
      setPreview({
        video_frame: null,
        audio: null,
      });

      // Очищаем инпуты
      if (videoInputRef.current) videoInputRef.current.value = '';
      if (audioInputRef.current) audioInputRef.current.value = '';

    } catch (error) {
      console.error('Ошибка при отправке:', error);

      // Более детальная обработка ошибок
      let errorMessage = "Noma'lum xatolik";
      if (error.response) {
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error: No response from server";
      } else {
        errorMessage = error.message;
      }

      Alert(`Xatolik: ${errorMessage}`, "error");
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <Button onClick={handleOpen} color="blue">
        Create Section
      </Button>

      <Dialog open={open} handler={handleOpen} size="xl">
        <DialogHeader>Create Exam Section</DialogHeader>
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
              name="type"
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

            {/* Video Upload */}
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="video/*"
                name="video_frame"
                ref={videoInputRef}
                hidden
                onChange={handleFileChange}
              />
              <Button
                variant="outlined"
                color="blue"
                fullWidth
                onClick={handleVideoUpload}
              >
                Upload Video
              </Button>
              {preview.video_frame && (
                <>
                  <video controls className="w-full rounded">
                    <source src={preview.video_frame} />
                  </video>
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => removeFile("video_frame")}
                  >
                    Remove Video
                  </Button>
                </>
              )}
            </div>

            {/* Audio Upload */}
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="audio/*"
                name="audio"
                ref={audioInputRef}
                hidden
                onChange={handleFileChange}
              />
              <Button
                variant="outlined"
                color="blue"
                fullWidth
                onClick={handleAudioUpload}
              >
                Upload Audio
              </Button>
              {preview.audio && (
                <>
                  <audio controls className="w-full">
                    <source src={preview.audio} />
                  </audio>
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => removeFile("audio")}
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
          <Button color="green" onClick={handleCreate} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}