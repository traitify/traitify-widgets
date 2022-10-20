import PropTypes from "prop-types";
import style from "./style.scss";

function CareerModalResources({resources}) {
  return (
    <div className={style.list}>
      {resources.map((resource) => (
        <div className={style.listItem} key={resource.id}>
          <div className={style.title}>{resource.name}</div>
          <div className={style.description}>{resource.description}</div>
          {resource.url && (
            <a className={`${style.description} flex`} href={resource.url}> More info</a>
          )}
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
  ).isRequired
};

export default CareerModalResources;
