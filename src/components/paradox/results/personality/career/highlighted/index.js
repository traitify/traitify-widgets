import withTraitify from "lib/with-traitify";
import PropTypes from "prop-types";
import Career from "../details";
import style from "./style.scss";

function HighlightedCareer({careers, ...props}) {
  return (
    <div className={style.container}>
      <div className={style.header}>Highlighted Careers</div>
      <div className={style.content}>
        {careers.map((_career) => {
          const {career, score} = _career;

          return <Career key={career.id} career={{score, ...career}} {...props} />;
        })}
      </div>
    </div>
  );
}
HighlightedCareer.propTypes = {
  careers: PropTypes.arrayOf(PropTypes.shape({}))
};
HighlightedCareer.defaultProps = {
  careers: [{}]
};
export {HighlightedCareer as Component};
export default withTraitify(HighlightedCareer);
