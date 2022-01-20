import {
  faColumns,
  faThLarge
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {Component as Paradox} from "components/paradox/results/manager-results";
import Guide from "components/results/guide";
import PersonalityRecommendationChart from "components/results/personality/recommendation/chart";
import Icon from "lib/helpers/icon";
import withTraitify from "lib/with-traitify";
import style from "../style.scss";

function ManagerResults(props) {
  const {getOption, translate} = props;
  const allowHeaders = getOption("allowHeaders");

  return (
    <section>
      {allowHeaders && (
        <>
          <p className={style.heading}><Icon icon={faColumns} /> {translate("recommendation_chart_heading")}</p>
          <p>{translate("recommendation_chart_description")}</p>
        </>
      )}
      <PersonalityRecommendationChart {...props} />
      {allowHeaders && (
        <>
          <p className={style.heading}><Icon icon={faThLarge} /> {translate("interview_guide_heading")}</p>
          <p>{translate("interview_guide_description")}</p>
        </>
      )}
      <Guide {...props} />
    </section>
  );
}

ManagerResults.propTypes = {
  getOption: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export {ManagerResults as Component};
export default withTraitify(ManagerResults, {paradox: Paradox});
