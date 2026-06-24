/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from "prop-types";
import {useState} from "react";
import Modal from "components/common/modal";
import useTranslate from "lib/hooks/use-translate";

const videoProps = {
  autoPlay: true,
  controls: true,
  disablePictureInPicture: true,
  disableRemotePlayback: true,
  playsInline: true
};

function VideoModal({onClose: closeModal, onReady, url}) {
  const [started, setStarted] = useState(false);
  const translate = useTranslate();
  const onClose = () => {
    closeModal();
    if(started) { onReady(); }
  };
  const onStart = () => setStarted(true);

  return (
    <Modal divider={false} onClose={onClose} title={translate("survey.rjp.modal.heading")}>
      <video
        onError={onStart}
        onPlay={onStart}
        {...videoProps}
      >
        <source src={url} type="video/mp4" />
      </video>
    </Modal>
  );
}

VideoModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired
};

export default VideoModal;
