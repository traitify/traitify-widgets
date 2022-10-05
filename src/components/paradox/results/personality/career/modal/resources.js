import PropTypes from "prop-types";
import style from "./style.scss";

function CareerModalResources({resources}) {
  return (
    <div className={style.list}>
      {resources.map((resource) => (
        <div className={style.listItem} key={resource.id}>
          <div className={style.title}>{resource.name}</div>
          <div className={style.description}>{resource.description}</div>
        </div>
      ))}
    </div>
  );
}

CareerModalResources.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};

export default CareerModalResources;
