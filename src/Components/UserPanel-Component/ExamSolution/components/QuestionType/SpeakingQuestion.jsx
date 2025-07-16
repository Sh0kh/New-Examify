import { useEffect, useRef, useState } from "react";
import { $api } from "../../../../../utils";
import parse from "html-react-parser";
import CONFIG from "../../../../../utils/Config";

export default function SpeakingQuestion({ question, onAnswer, userAnswer, theme, examResultId }) {
    const [recording, setRecording] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [recordTime, setRecordTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    // Recording timer
    useEffect(() => {
        if (recording) {
            timerRef.current = setInterval(() => {
                setRecordTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [recording]);

    const handleRecord = async () => {
        if (!recording) {
            try {
                setRecordTime(0);
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                audioChunksRef.current = [];

                mediaRecorderRef.current.ondataavailable = (e) => {
                    audioChunksRef.current.push(e.data);
                };

                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                    await uploadAudio(audioBlob);
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorderRef.current.start();
                setRecording(true);
            } catch (error) {
                console.error("Microphone permission denied:", error);
                alert("Microphone access denied. Please allow microphone access to record your answer.");
            }
        } else {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const uploadAudio = async (audioBlob) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("audio", audioBlob, "answer.webm");
        formData.append("exam_result_id", examResultId);
        formData.append("question_id", question.id);

        try {
            const response = await $api.post("/user/upload-audio", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            onAnswer({
                answer_id: response.data.id,
                file_path: response.data.file_path || null,
                answer_text: null
            });

        } catch (error) {
            console.error("Audio upload error:", error);
            alert("Failed to upload audio. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6">
            {/* Question Section */}
            <div className="flex flex-col space-y-4">
                <p
                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}
                    dangerouslySetInnerHTML={{ __html: question.question_text }}
                />
                {question.image_url && (
                    <img
                        src={CONFIG.API_URL + question.image_url}
                        alt="Question visual"
                        className="max-w-full md:max-w-[400px] h-auto rounded-lg border"
                    />
                )}
            </div>

            {/* Recording Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRecord}
                        disabled={uploading}
                        className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all
                            ${recording
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : theme === 'dark'
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }
                            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        {recording ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                                </svg>
                                Stop Recording
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                                Start Recording Answer
                            </>
                        )}
                    </button>

                    {recording && (
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                            <span className="font-medium">
                                {formatTime(recordTime)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Status Messages */}
                {uploading && (
                    <div className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`}>
                        <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-blue-700'}>
                            Uploading audio...
                        </span>
                    </div>
                )}

                {userAnswer && !uploading && (
                    <div className={`flex items-center p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/30 border border-green-800' : 'bg-green-100 border border-green-200'}`}>
                        <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={theme === 'dark' ? 'text-green-300' : 'text-green-700'}>
                            Audio answer uploaded successfully
                        </span>
                        <button
                            onClick={handleRecord}
                            className="ml-auto text-sm px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Re-record
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}