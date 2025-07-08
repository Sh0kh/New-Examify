import React, { useEffect, useRef } from 'react';
import video from '../../../../Images/qollanma.mp4';

const MonualModal = ({ isOpen, onClose }) => {
  const videoRef = useRef(null); // Реф для видео

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play(); // Автозапуск видео
    } else if (videoRef.current) {
      videoRef.current.pause(); // Остановка видео при закрытии
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 bg-[#0000006b] z-50 flex items-center justify-center transition-opacity duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
    >
      <div
        className={`Monual p-[10px] bg-white rounded-[8px] w-[95%] md:w-[50%] lg:w-[50%] py-[30px] transform transition-all duration-500 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10'}`}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="mt-4">
          <video
            ref={videoRef} // Устанавливаем ref на видео
            width="100%"
            height="315"
            controls
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default MonualModal;
