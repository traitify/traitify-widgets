import PropTypes from "prop-types";
import PersonalityDimensionChart from "components/results/personality/dimension/chart";
import PersonalityDimensionDetails from "components/results/personality/dimension/details";
import {sortByTypePosition} from "lib/helpers";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityDimensionList({element, ...props}) {
  const {assessment, getOption, isReady, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityDimensions.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityDimensions.updated", {props, state}); });

  if(!isReady("results")) { return null; }
  const disabledComponents = getOption("disabledComponents") || [];
  const disableChart = disabledComponents
    .some((c) => ["PersonalityDimensionChart", "PersonalityDimensionColumns"].includes(c));
  const disableDetails = disabledComponents.includes("PersonalityDimensionDetails");
  if(disableChart && disableDetails) { return null; }

  const types = sortByTypePosition(assessment.personality_types);

  return (
    <div className={style.container} ref={element}>
      {!disableChart && <PersonalityDimensionChart {...props} />}
      {!disableDetails && (
        <div>
          {types.map((type) => (
            <PersonalityDimensionDetails
              key={type.personality_type.id}
              type={type}
              {...props}
            />
          ))}
        </div>
      )}
    </div>
  );
}

PersonalityDimensionList.defaultProps = {assessment: null, element: null};
PersonalityDimensionList.propTypes = {
  assessment: PropTypes.shape({
    personality_types: PropTypes.arrayOf(
      PropTypes.shape({
        personality_type: PropTypes.shape({
          id: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    )
  }),
  element: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({current: PropTypes.instanceOf(Element)})
  ]),
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityDimensionList as Component};
export default withTraitify(PersonalityDimensionList);
