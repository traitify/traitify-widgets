import {faCaretLeft, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Icon from "components/common/icon";
import style from "./style.scss";

function CarouselContent({Component, FallbackComponent, count, records = null}) {
  const [start, setStart] = useState(0);
  const end = start + count;

  useEffect(() => { setStart(0); }, [count]);

  if(!records || records.length === 0) {
    return <div className={style.container}><FallbackComponent /></div>;
  }

  const onBack = () => {
    const nextStart = start - count;

    setStart(nextStart > 0 ? nextStart : 0);
  };
  const onNext = () => {
    setStart(end + count >= records.length ? records.length - count : end);
  };

  return (
    <div className={style.container}>
      <button className={style.back} disabled={start <= 0} onClick={onBack} type="button">
        <Icon alt="Left" icon={faCaretLeft} />
      </button>
      <div className={style.content}>
        {records.slice(start, end).map((record, index) => (
          /* eslint-disable-next-line react/no-array-index-key */
          <Component key={index} record={record} />
        ))}
      </div>
      <button className={style.next} disabled={end >= records.length} onClick={onNext} type="button">
        <Icon alt="Right" icon={faCaretRight} />
      </button>
    </div>
  );
}

CarouselContent.propTypes = {
  Component: PropTypes.elementType.isRequired,
  FallbackComponent: PropTypes.elementType.isRequired,
  count: PropTypes.number.isRequired,
  records: PropTypes.arrayOf(PropTypes.shape({}).isRequired)
};

export default CarouselContent;
