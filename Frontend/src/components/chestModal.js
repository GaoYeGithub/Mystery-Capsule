import React, { useRef, useEffect, useState } from "react";
import { useTransition, a } from "react-spring";
import chestCloseSound from "../assets/sound/close-chest.mp3";

const closeChest = new Audio(chestCloseSound);

const ChestModal = ({ open, setOpen }) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);

  const closeModal = () => {
    setOpen(false);
    closeChest.volume = 0.3;
    closeChest.play();
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    
    let videoId = '';
    
    if (url.includes('youtu.be')) {
      videoId = url.split('youtu.be/')[1];
    } 
    else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v');
    }

    if (!videoId) return '';
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  useEffect(() => {
    const fetchVideo = async () => {
      setIsLoading(true);
      try {
        const pathSegments = window.location.pathname.split('/');
        const currentId = pathSegments[pathSegments.length - 1];
        const response = await fetch('https://discord-mystery.pockethost.io/api/collections/boxes/records');
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          if (currentId && currentId.length > 5) {
            const video = data.items.find(item => item.id === currentId);
            if (video) {
              const embedUrl = getYoutubeEmbedUrl(video.field);
              setYoutubeUrl(embedUrl);
            } else {
              const embedUrl = getYoutubeEmbedUrl(data.items[0].field);
              setYoutubeUrl(embedUrl);
            }
          } else {
            const embedUrl = getYoutubeEmbedUrl(data.items[0].field);
            setYoutubeUrl(embedUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching YouTube URL:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchVideo();
    }
  }, [open]);

  const transitions = useTransition(open, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <a.div key={key} style={props} className="modal-chest-wrapper">
          <div onClick={closeModal} className="overlay" />
          <div className="modal-chest">
            <div className="top">
              <div className="header">
                <h4>Surprise!</h4>
                <div onClick={closeModal} className="close">
                  x
                </div>
              </div>
              <div className="video-container">
                {isLoading ? (
                  <div className="loading-state">
                    Loading surprise...
                  </div>
                ) : youtubeUrl ? (
                  <iframe
                    ref={iframeRef}
                    src={youtubeUrl}
                    className="surprise-video"
                    style={{
                      width: '100%',
                      height: '70vh',
                      border: 'none'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="error-state">
                    Video not found
                  </div>
                )}
              </div>
            </div>
          </div>
        </a.div>
      )
  );
};

export default ChestModal;