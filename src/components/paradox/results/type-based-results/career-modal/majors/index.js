import PropTypes from "prop-types";
import style from "./style.scss";

function Majors({majors}) {

  return (
    <div className={style.container}>
      {majors.map((major) =>
        <div className={style.major} key={major.id}>
          <div className={style.title}>{major.title}</div>
          <div className={style.description}>{major.description}</div>
        </div>
      )}
    </div>
  )
}
export default Majors;

Majors.propTypes = {
  majors: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
}
