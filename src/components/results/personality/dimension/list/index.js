import PropTypes from "prop-types";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import PersonalityDimensionColumns from "components/results/personality/dimension/columns";
import PersonalityDimensionDetails from "components/results/personality/dimension/details";
import style from "./style";

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

  const types = assessment.personality_types.sort((x, y) => {
    const xDetail = x.personality_type.details.find(({title}) => title === "Position") || {};
    const yDetail = y.personality_type.details.find(({title}) => title === "Position") || {};

    return (xDetail.body || 1) - (yDetail.body || 1);
  });

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
  assessment: PropTypes.shape({personality_types: PropTypes.array}),
  getOption: PropTypes.func.isRequired,
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityDimensionList as Component};
export default withTraitify(PersonalityDimensionList);
