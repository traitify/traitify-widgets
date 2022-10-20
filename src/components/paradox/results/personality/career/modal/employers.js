import PropTypes from "prop-types";
import style from "./style.scss";

function CareerModalEmployers({employers}) {
  return (
    <div className={style.list}>
      {employers.map((employer) => (
        <div className={style.listItem} key={employer.id}>
          <div className={style.title}>{employer.name}</div>
          <div className={style.description}>{employer.description}</div>
          {employer.url && (
            <a className={`${style.description} flex`} href={employer.url}> More info</a>
          )}
        </div>
      ))}
    </div>
  );
}

CareerModalEmployers.propTypes = {
  employers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired
};

export default CareerModalEmployers;
