import PropTypes from "prop-types";
import style from "./style.scss";

function CareerModalResources({resources, translate}) {
  return (
    <div className={style.list}>
      {resources.map((resource) => (
        <div className={style.listItem} key={resource.url}>
          <div className={style.job}>
            <div className={style.jobDetails}>
              <div>
                <div className={style.title}>
                  {resource.name}
                </div>
                <div className={style.description}>
                  {resource.description}
                </div>
              </div>
            </div>
            <div>
              <a className={style.applyNowButton} href={resource.url}>
                {translate("learn_more")}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

CareerModalResources.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string
    })
  ).isRequired,
  translate: PropTypes.func.isRequired
};

export default CareerModalResources;
