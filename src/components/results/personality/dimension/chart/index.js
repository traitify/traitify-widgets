import PropTypes from "prop-types";
import {Component as Paradox} from "components/paradox/results/personality/dimension/chart";
import PersonalityDimensionColumn from "components/results/personality/dimension/column";
import {sortByTypePosition} from "lib/helpers";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function PersonalityDimensionChart(props) {
  const {assessment, isReady, translate, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityDimensionChart.initialized", {props, state}); });
  useDidMount(() => { ui.trigger("PersonalityDimensionColumns.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityDimensionChart.updated", {props, state}); });
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

PersonalityDimensionChart.defaultProps = {assessment: null};
PersonalityDimensionChart.propTypes = {
  assessment: PropTypes.shape({
    personality_types: PropTypes.arrayOf(
      PropTypes.shape({
        personality_type: PropTypes.shape({
          id: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    )
  }),
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityDimensionChart as Component};
export default withTraitify(PersonalityDimensionChart, {paradox: Paradox});
