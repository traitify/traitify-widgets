import PropTypes from "prop-types";
import style from "./style.scss";

function Clubs({clubs}) {
  return (
    <div className={style.container}>
      {clubs.map((club) => (
        <div className={style.club} key={club.id}>
          <div className={style.title}>{club.title}</div>
          <div className={style.description}>{club.description}</div>
        </div>
      ))}
    </div>
  );
}
Clubs.propTypes = {
  clubs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};
export default Clubs;
