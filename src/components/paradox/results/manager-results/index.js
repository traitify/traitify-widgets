import PropTypes from "prop-types";
import withTraitify from "lib/with-traitify";
import Guide from "components/results/guide";
import PersonalityRecommendationChart from "components/results/personality/recommendation/chart";
import style from "../style.scss";

function ManagerResults({setElement, ...props}) {
  const {getOption, translate} = props;
  const allowHeaders = getOption("allowHeaders");
  console.log("paradox results")
  console.dir(props)

  return (
    <section className={[style.container, style.box].join(" ")} ref={setElement}>
      {allowHeaders && (
        <>
          <div className={style.sectionHeading}>{translate("recommendation_chart_heading")}</div>
          <div className={style.p}>{translate("recommendation_chart_description")}</div>
        </>
      )}
      <PersonalityRecommendationChart combined={true} {...props} />
      <Guide combined={true} {...props} />
    </section>
  );
}

ManagerResults.propTypes = {
  getOption: PropTypes.func.isRequired,
  setElement: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export {ManagerResults as Component};
export default withTraitify(ManagerResults);
