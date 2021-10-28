import {faChevronDown, faChevronUp, faQuestion} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {sortByTypePosition} from "lib/helpers";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import Icon from "lib/helpers/icon";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

const colors = {high: "#29B770", low: "#EF615E", medium: "#FFCC3B", other: "black"};
const colorFrom = ({benchmark, score, typeID}) => {
  if(!benchmark) {
    if(score <= 3) { return colors.low; }
    if(score <= 6) { return colors.medium; }

    return colors.high;
  }

  const range = benchmark
    .range_types.find(({id}) => id === typeID)
    .ranges.find(({max_score: max, min_score: min}) => score >= min && score <= max);

  if(range.match_score === 5) { return colors.low; }
  if(range.match_score === 10) { return colors.medium; }
  if(range.match_score === 20) { return colors.high; }

  return colors.other;
};

const toList = (entity) => (
  /* eslint-disable-next-line react/no-array-index-key */
  <ul>{entity.split("\n").map((e, i) => <li key={i}>{e}</li>)}</ul>
);

function Question({question, translate}) {
  const [showContent, setShowContent] = useState(question.order === 1);

  return (
    <div className={style.question}>
      <div className={style.text}>
        <Icon className={style.icon} icon={faQuestion} />
        <div>{question.text}</div>
        <button onClick={() => setShowContent(!showContent)} type="button">
          <Icon className={style.icon} icon={showContent ? faChevronUp : faChevronDown} />
        </button>
      </div>
      {showContent && (
        <>
          <div className={style.h2}>{translate("question_purpose")}</div>
          <div>{toList(question.purpose)}</div>
          {question.adaptability && (
            <>
              <div className={style.h2}>{translate("question_adaptability")}</div>
              <div>{toList(question.adaptability)}</div>
            </>
          )}
        </>
      )}
    </div>
  );
}

Question.propTypes = {
  question: PropTypes.shape({
    adaptability: PropTypes.string,
    order: PropTypes.number.isRequired,
    purpose: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  translate: PropTypes.func.isRequired
};

function Guide(props) {
  const {
    assessment,
    benchmark,
    followBenchmark,
    followGuide,
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

    const _data = sortByTypePosition(types).map(({personality_type: {badge, id}, score}) => {
      const color = colorFrom({benchmark, score, typeID: id});
      const competency = competencies
        .find(({questionSequences}) => questionSequences[0].personalityTypeId === id);

      return {...competency, badge: badge.image_medium, color, score};
    });

    const sortedData = _data.filter(({color}) => color === colors.low);
    sortedData.push(..._data.filter(({color}) => color === colors.medium));
    sortedData.push(..._data.filter(({color}) => color === colors.high));
    sortedData.push(..._data.filter(({color}) => color === colors.other));

    setData(sortedData);
    setActiveCompetency(sortedData[0]);
  }, [
    dig(assessment, "id"),
    dig(benchmark, "id"),
    dig(guide, "assessment_id"),
    dig(guide, "locale_key")
  ]);

  if(!isReady("guide")) { return null; }
  if(!isReady("results")) { return null; }
  if(!activeCompetency) { return null; }

  const showCompetency = (newID) => setActiveCompetency(data.find(({id}) => newID === id));
  const [intro, ...expandedIntro] = activeCompetency.introduction.split("\n");
  const onChange = ({target: {value}}) => showCompetency(value);
  const index = data.indexOf(activeCompetency);
  const contentClass = [
    style.content,
    index === 0 && style.first,
    index === data.length - 1 && style.last
  ].filter(Boolean).join(" ");

  return (
    <div className={style.container}>
      <div className={style.tabs}>
        {data.map(({id, name}) => (
          <button
            key={id}
            className={id === activeCompetency.id ? style.active : ""}
            onClick={() => showCompetency(id)}
            type="button"
          >
            <span>{name}</span>
          </button>
        ))}
      </div>
      <div className={contentClass}>
        <select className={style.dropdown} onChange={onChange} value={activeCompetency.id}>
          {data.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
        </select>
        <div className={style.heading}>{activeCompetency.name}</div>
        {intro}
        <p>
          <button onClick={() => setShowExpandedIntro(!showExpandedIntro)} type="button">
            {translate("read_more")}
          </button>
        </p>
        {showExpandedIntro && <p>{expandedIntro.join("\n").trim()}</p>}
        <hr />
        {activeCompetency.questionSequences.map((sequence) => (
          <div key={sequence.id}>
            <div className={style.heading}>{sequence.name}</div>
            <p>{translate("guide_intro")}</p>
            {sequence.questions.map((question) => (
              <Question key={question.id} question={question} translate={translate} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

Guide.defaultProps = {assessment: null, benchmark: null, guide: null};
Guide.propTypes = {
  assessment: PropTypes.shape({
    assessment_type: PropTypes.string,
    personality_types: PropTypes.arrayOf(
      PropTypes.shape({
        personality_type: PropTypes.shape({
          badge: PropTypes.shape({
            image_medium: PropTypes.string.isRequired
          }).isRequired,
          id: PropTypes.string.isRequired
        }).isRequired,
        score: PropTypes.number.isRequired
      }).isRequired
    )
  }),
  benchmark: PropTypes.shape({
    id: PropTypes.string,
    range_types: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        ranges: PropTypes.arrayOf(
          PropTypes.shape({
            match_score: PropTypes.number.isRequired,
            max_score: PropTypes.number.isRequired,
            min_score: PropTypes.number.isRequired
          }).isRequired
        ).isRequired
      }).isRequired
    )
  }),
  followBenchmark: PropTypes.func.isRequired,
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
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {Guide as Component};
export default withTraitify(Guide);
