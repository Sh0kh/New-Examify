import React, { useEffect, useRef } from 'react';

const MonualModal = ({ isOpen, onClose }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      createPlayer();
    }

    window.onYouTubeIframeAPIReady = () => {
      createPlayer();
    };

    function createPlayer() {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: 'fMQIG_wk7Vk',
          events: {
            onReady: (event) => {
              if (!isOpen) event.target.pauseVideo();
            },
          },
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen && playerRef.current?.stopVideo) {
      playerRef.current.stopVideo();
    }
  }, [isOpen]);

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 bg-[#0000006b] z-50 flex items-center justify-center transition-opacity duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
    >
      <div
        className={`Monual p-[10px] bg-white rounded-[8px] w-[95%] md:w-[50%] lg:w-[50%] py-[30px] transform transition-all duration-500 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-4 w-full aspect-video">
          <div className="w-full h-full">
            {/* Контейнер для API */}
            <div id="youtube-player" className="w-full h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonualModal;
