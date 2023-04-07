import {faClock} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Icon from "components/common/icon";
import style from "./style.scss";

function Timer({onFinish, startTime, timeAllowed}) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const timePassed = Date.now() - startTime;
      const _timeLeft = timeAllowed - (timePassed / 1000);

      return _timeLeft < 0 ? 0 : _timeLeft;
    };

    if(!timeLeft) { return setTimeLeft(calculateTimeLeft()); }

    setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();

      setTimeLeft(newTimeLeft);
    }, 1000);
  }, [startTime, timeAllowed, timeLeft]);

  useEffect(() => {
    if(timeLeft === 0) { onFinish(); }
  }, [timeLeft]);

  const minutes = Math.floor((timeLeft / 60) % 60);
  const seconds = Math.floor(timeLeft % 60);

  return (
    <div className={style.timer}>
      <Icon icon={faClock} /> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}

Timer.propTypes = {
  onFinish: PropTypes.func.isRequired,
  startTime: PropTypes.number.isRequired,
  timeAllowed: PropTypes.number.isRequired
};

export default Timer;
