import PropTypes from "prop-types";
import PersonalityDimensionColumn from "components/results/personality/dimension/column";
import {sortByTypePosition} from "lib/helpers";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style";

function PersonalityDimensionColumns(props) {
  const {assessment, isReady, translate, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityDimensionColumns.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityDimensionColumns.updated", {props, state}); });

  if(!isReady("results")) { return null; }

  const types = sortByTypePosition(assessment.personality_types);

  return (
    <div className={style.container}>
      <p>{translate("dimension_description")}</p>
      <ul className={style.columns}>
        {types.map((type) => (
          <PersonalityDimensionColumn
            key={type.personality_type.id}
            type={type}
            {...props}
          />
        ))}
      </ul>
      <div className={style.columnsBuffer} />
    </div>
  );
}

PersonalityDimensionColumns.defaultProps = {assessment: null};
PersonalityDimensionColumns.propTypes = {
  assessment: PropTypes.shape({personality_types: PropTypes.array}),
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityDimensionColumns as Component};
export default withTraitify(PersonalityDimensionColumns);
