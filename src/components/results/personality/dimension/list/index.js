import PropTypes from "prop-types";
import PersonalityDimensionColumns from "components/results/personality/dimension/columns";
import PersonalityDimensionDetails from "components/results/personality/dimension/details";
import {sortByTypePosition} from "lib/helpers";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityDimensionList(props) {
  const {assessment, getOption, isReady, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityDimensions.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityDimensions.updated", {props, state}); });

  if(!isReady("results")) { return null; }
  const disabledComponents = getOption("disabledComponents") || [];
  const disableColumns = disabledComponents.includes("PersonalityDimensionColumns");
  const disableDetails = disabledComponents.includes("PersonalityDimensionDetails");
  if(disableColumns && disableDetails) { return null; }

  const types = sortByTypePosition(assessment.personality_types);

  return (
    <div className={style.container}>
      {!disableColumns && <PersonalityDimensionColumns {...props} />}
      {!disableDetails && (
        <ul className={style.details}>
          {types.map((type) => (
            <PersonalityDimensionDetails
              key={type.personality_type.id}
              type={type}
              {...props}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

PersonalityDimensionList.defaultProps = {assessment: null};
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
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityDimensionList as Component};
export default withTraitify(PersonalityDimensionList);
