import PropTypes from "prop-types";
import style from "./style.scss";

function Majors({majors}) {
  return (
    <div className={style.list}>
      {majors.map((major) => (
        <div className={style.listItem} key={major.id}>
          <div className={style.title}>{major.title}</div>
          <div className={style.description}>{major.description}</div>
        </div>
      ))}
    </div>
  );
}

Majors.propTypes = {
  majors: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Majors;
