import PropTypes from "prop-types";
import style from "./style.scss";

function CareerModalEmployers({employers, translate}) {
  return (
    <div className={style.list}>
      {employers.map((employer) => (
        <div className={style.listItem} key={employer.url}>
          <div className={style.job}>
            <div className={style.jobDetails}>
              <div>
                <div className={style.title}>
                  {employer.name}
                </div>
                <div className={style.description}>
                  {employer.description}
                </div>
              </div>
            </div>
            <div>
              <a className={style.applyNowButton} href={employer.url}>
                {translate("learn_more")}
              </a>
            </div>
          </div>
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
      url: PropTypes.string
    })
  ).isRequired,
  translate: PropTypes.func.isRequired
};

export default CareerModalEmployers;
