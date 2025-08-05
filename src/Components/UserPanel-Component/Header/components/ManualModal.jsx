import React from 'react';

const MonualModal = ({ isOpen, onClose }) => {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 bg-[#0000006b] z-50 flex items-center justify-center transition-opacity duration-500 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div
        className={`Monual p-[10px] bg-white rounded-[8px] w-[95%] md:w-[50%] lg:w-[50%] py-[30px] transform transition-all duration-500 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-4 w-full aspect-video">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/fMQIG_wk7Vk"
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MonualModal;
