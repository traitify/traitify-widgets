import {useEffect, useState} from "react";

export default function useFullscreen(element) {
  const [fullscreen, setFullscreen] = useState(() => [
    document.fullscreenElement,
    document.webkitFullscreenElement,
    document.mozFullScreenElement,
    document.msFullscreenElement
  ].some(Boolean));
  const toggle = () => {
    if(fullscreen) {
      const exitFullscreen = document.exitFullscreen
        || document.webkitExitFullscreen
        || document.mozCancelFullScreen
        || document.msExitFullscreen;

      exitFullscreen.apply(document);
    } else if(element) {
      const requestFullscreen = element.requestFullscreen
        || element.webkitRequestFullscreen
        || element.mozRequestFullScreen
        || element.msRequestFullscreen;

      requestFullscreen.apply(element);
    }
  };

  useEffect(() => {
    const onChange = () => {
      const fullscreenElement = document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullScreenElement
        || document.msFullscreenElement;

      setFullscreen(!!fullscreenElement);
    };

    window.addEventListener("fullscreenchange", onChange);
    window.addEventListener("webkitfullscreenchange", onChange);
    window.addEventListener("mozfullscreenchange", onChange);
    window.addEventListener("MSFullscreenChange", onChange);

    return () => {
      window.removeEventListener("fullscreenchange", onChange);
      window.removeEventListener("webkitfullscreenchange", onChange);
      window.removeEventListener("mozfullscreenchange", onChange);
      window.removeEventListener("MSFullscreenChange", onChange);
    };
  }, []);

  return [fullscreen, toggle];
}
