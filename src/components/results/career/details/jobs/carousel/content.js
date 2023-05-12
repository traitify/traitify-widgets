import {faCaretLeft, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Icon from "components/common/icon";
import style from "./style.scss";

function CarouselContent({Component, FallbackComponent, count, records}) {
  const [start, setStart] = useState(0);
  const end = start + count;
  const onBack = () => {
    const nextStart = start - count;

    setStart(nextStart > 0 ? nextStart : 0);
  };
  const onNext = () => {
    setStart(end + count >= records.length ? records.length - count : end);
  };

  useEffect(() => { setStart(0); }, [count]);

  if(records.length === 0) {
    return <div className={style.container}>{FallbackComponent}</div>;
  }

  return (
    <div className={style.container}>
      <button className={style.back} disabled={start <= 0} onClick={onBack} type="button">
        <Icon icon={faCaretLeft} />
      </button>
      {records.slice(start, end).map((record, index) => (
        <Component key={index} record={record} /> /* eslint-disable-line react/no-array-index-key */
      ))}
      <button className={style.next} disabled={end >= records.length} onClick={onNext} type="button">
        <Icon icon={faCaretRight} />
      </button>
    </div>
  );
}

CarouselContent.propTypes = {
  Component: PropTypes.elementType.isRequired,
  FallbackComponent: PropTypes.elementType.isRequired,
  count: PropTypes.number.isRequired,
  records: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

export default CarouselContent;
