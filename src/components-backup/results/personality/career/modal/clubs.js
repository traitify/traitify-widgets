import PropTypes from "prop-types";
import style from "./style.scss";

function CareerModalClubs({clubs}) {
  return (
    <div className={style.list}>
      {clubs.map((club) => (
        <div className={style.listItem} key={club.id}>
          <div className={style.title}>{club.name}</div>
          <div className={style.description}>{club.description}</div>
        </div>
      ))}
    </div>
  );
}

CareerModalClubs.propTypes = {
  clubs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

export default CareerModalClubs;
