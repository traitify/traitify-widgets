import PropTypes from "prop-types";
import {reverse} from "lib/helpers/array";
import {combine} from "lib/helpers/combine-data";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

const ranks = ["other", "low", "medium", "high"];

function PersonalityDimensionChart({setElement, ...props}) {
  const {assessment, followGuide, guide, isReady, translate, ui} = props;
  const state = {};

  useDidMount(() => { ui.trigger("PersonalityDimensionChart.initialized", {props, state}); });
  useDidMount(() => { ui.trigger("PersonalityDimensionColumns.initialized", {props, state}); });
  useDidMount(() => { followGuide(); });
  useDidUpdate(() => { ui.trigger("PersonalityDimensionChart.updated", {props, state}); });
  useDidUpdate(() => { ui.trigger("PersonalityDimensionColumns.updated", {props, state}); });

  if(!isReady("results")) { return null; }

  const data = combine({guide, order: "types", types: assessment.personality_types});

  return (
    <div className={style.container} ref={setElement}>
      <div className={style.p}>{translate("dimension_description")}</div>
      <div className={style.horizontal}>
        {data.map(({competency, rank, type: {badge, name, id}}) => (
          <div key={id} className={[style.row, style[rank]].join(" ")}>
            <div className={style.label}>
              {competency && <div>{competency.name}</div>}
              <div>{name}</div>
            </div>
            <img src={badge.image_medium} alt={`${name} ${translate("badge")}`} />
          </div>
        ))}
        <div className={style.scale}>
          {ranks.map((rank) => <div key={rank} />)}
        </div>
      </div>
      <div className={style.vertical}>
        <div className={style.scale}>
          {reverse(ranks).map((rank) => <div key={rank} />)}
        </div>
        {data.map(({competency, rank, type: {badge, name, id}}) => (
          <div key={id} className={[style.column, style[rank]].join(" ")}>
            <img src={badge.image_medium} alt={`${name} ${translate("badge")}`} />
            {competency && <div className={style.heading}>{competency.name}</div>}
            <div className={style.heading}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

PersonalityDimensionChart.defaultProps = {assessment: null, guide: null};
PersonalityDimensionChart.propTypes = {
  assessment: PropTypes.shape({
    personality_types: PropTypes.arrayOf(
      PropTypes.shape({
        personality_type: PropTypes.shape({
          badge: PropTypes.shape({image_medium: PropTypes.string.isRequired}).isRequired,
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        }).isRequired,
        score: PropTypes.number.isRequired
      }).isRequired
    )
  }),
  followGuide: PropTypes.func.isRequired,
  guide: PropTypes.shape({
    assessment_id: PropTypes.string.isRequired,
    competencies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        questionSequences: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            personalityTypeId: PropTypes.string.isRequired,
            questions: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.string.isRequired
              }).isRequired
            ).isRequired
          }).isRequired
        ).isRequired
      }).isRequired
    ).isRequired,
    locale_key: PropTypes.string.isRequired
  }),
  isReady: PropTypes.func.isRequired,
  setElement: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {PersonalityDimensionChart as Component};
export default withTraitify(PersonalityDimensionChart);
