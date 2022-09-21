import Markdown from "markdown-to-jsx";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {combine} from "lib/helpers/combine-data";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import Question from "./question";
import style from "./style.scss";

function Guide({setElement, ...props}) {
  const {
    assessment,
    benchmark,
    combined,
    followBenchmark,
    followGuide,
    getOption,
    guide,
    isReady,
    translate,
    ui
  } = props;
  const [activeCompetency, setActiveCompetency] = useState(null);
  const [data, setData] = useState([]);
  const [showExpandedIntro, setShowExpandedIntro] = useState(false);
  const state = {activeCompetency, showExpandedIntro};

  useDidMount(() => { ui.trigger("Guide.initialized", {props, state}); });
  useDidMount(() => { followBenchmark(); });
  useDidMount(() => { followGuide(); });
  useDidUpdate(() => { ui.trigger("Guide.updated", {props, state}); });
  useEffect(() => {
    const competencies = dig(guide, "competencies") || [];
    const types = dig(assessment, "personality_types") || [];
    if(competencies.length === 0 || types.length === 0) { return; }

    const _data = combine({benchmark, guide, order: "types", types})
      .map(({competency, rank, score, type}) => ({...competency, rank, score, type}));

    setData(_data);
    setActiveCompetency(_data[0]);
  }, [
    dig(assessment, "id"),
    dig(benchmark, "id"),
    dig(guide, "assessment_id"),
    dig(guide, "locale_key")
  ]);

  const disabledComponents = getOption("disabledComponents") || [];
  if(disabledComponents.includes("InterviewGuide")) { return null; }
  if(!isReady("guide")) { return null; }
  if(!isReady("results")) { return null; }
  if(!activeCompetency) { return null; }

  const showCompetency = (newID) => setActiveCompetency(data.find(({id}) => newID === id));
  const [intro, ...expandedIntro] = activeCompetency.introduction.split("\n\n\n");
  const onChange = ({target: {value}}) => showCompetency(value);

  return (
    <div className={[style.container, combined && style.combined].filter(Boolean).join(" ")} ref={setElement}>
      <div className={style.tabs}>
        {data.map(({id, name, rank}) => (
          <button
            key={id}
            className={[id === activeCompetency.id && style.active, style[rank]].filter(Boolean).join(" ")}
            onClick={() => showCompetency(id)}
            type="button"
          >
            <span>{name}</span>
          </button>
        ))}
      </div>
      <div className={style.content}>
        <select className={style.dropdown} onChange={onChange} value={activeCompetency.id}>
          {data.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
        </select>
        <div className={[style.heading, style[activeCompetency.rank]].join(" ")}>{activeCompetency.name} ({activeCompetency.type.name})</div>
        <Markdown>{intro}</Markdown>
        <div className={style.p}>
          <button className={style.readMore} onClick={() => setShowExpandedIntro(!showExpandedIntro)} type="button">
            {translate(showExpandedIntro ? "show_less" : "show_more")}
          </button>
        </div>
        {showExpandedIntro && (
          <Markdown className={`${style.p} ${style.expandedIntro}`}>{expandedIntro.join("\n\n\n").trim()}</Markdown>
        )}
        <div className={style.divider} />
        {activeCompetency.questionSequences.map((sequence) => (
          <div key={sequence.id}>
            <div className={style.heading}>{sequence.name}</div>
            {sequence.questions.map((question) => (
              <Question key={question.id} question={question} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

Guide.defaultProps = {
  assessment: null,
  benchmark: null,
  combined: false,
  guide: null
};
Guide.propTypes = {
  assessment: PropTypes.shape({
    assessment_type: PropTypes.string,
    personality_types: PropTypes.arrayOf(
      PropTypes.shape({
        personality_type: PropTypes.shape({id: PropTypes.string.isRequired}).isRequired,
        score: PropTypes.number.isRequired
      }).isRequired
    )
  }),
  benchmark: PropTypes.shape({
    id: PropTypes.string,
    hexColorLow: PropTypes.string.isRequired,
    hexColorMedium: PropTypes.string.isRequired,
    hexColorHigh: PropTypes.string.isRequired,
    dimensionRanges: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        dimensionId: PropTypes.string.isRequired,
        matchScore: PropTypes.number.isRequired,
        maxScore: PropTypes.number.isRequired,
        minScore: PropTypes.number.isRequired
      }).isRequired
    )
  }),
  combined: PropTypes.bool,
  followBenchmark: PropTypes.func.isRequired,
  followGuide: PropTypes.func.isRequired,
  getOption: PropTypes.func.isRequired,
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

export {Guide as Component};
export default withTraitify(Guide);
