import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
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
      <h3 id={question.order === 1 ? "traitify-question-1" : null}>{`Question ${question.order}`}</h3>
      <button onClick={() => setShowContent(!showContent)} type="button">
        <span className={style.questionText}>{question.text}</span>
        <Icon className={style.questionIcon} icon={showContent ? faChevronUp : faChevronDown} />
      </button>
      {showContent && (
        <>
          <h4>{translate("question_purpose")}</h4>
          <div>{toList(question.purpose)}</div>
          {question.adaptability && (
            <div>
              <h4>{translate("question_adaptability")}</h4>
              <div>{toList(question.adaptability)}</div>
            </div>
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

  return (
    <div className={style.tabsContainer}>
      <div className={style.tabContainer}>
        <div className={style.competencySelect}>
          <select className={style.mobileSelect} onChange={onChange} value={activeCompetency.id}>
            {data.map(({id, name}) => <option key={id} value={id}>{name}</option>)}
          </select>
          <p className={style.mobileBadge}>
            <img src={activeCompetency.badge} alt={`${activeCompetency.name} badge`} />
          </p>
        </div>
        <ul className={style.tabs}>
          {data.map(({badge, color, id, name}) => {
            const classes = [
              style.tab,
              id === activeCompetency.id && style.tabActive
            ].filter(Boolean);

            return (
              <li key={id} className={classes.join(" ")} style={{borderTopColor: color}}>
                <button onClick={() => showCompetency(id)} type="button">
                  <img src={badge} alt={`${name} badge`} />
                  <br />
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={style.tabsContent}>
        <div className={style.tabContentActive}>
          <h2>{activeCompetency.name}</h2>
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
              <h2>{sequence.name}</h2>
              <p>{translate("guide_intro")}</p>
              {sequence.questions.map((question) => (
                <Question key={question.id} question={question} translate={translate} />
              ))}
            </div>
          ))}
        </div>
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
