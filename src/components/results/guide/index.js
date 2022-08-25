import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {Component as Paradox} from "components/paradox/results/guide";
import {sortByTypePosition} from "lib/helpers";
import Icon from "lib/helpers/icon";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

const colorFrom = ({benchmark, score, typeID}) => {
  if(!benchmark) {
    if(score <= 3) { return benchmark.hexColorLow; }
    if(score <= 6) { return benchmark.hexColorMedium; }

    return benchmark.hexColorHigh;
  }

  const dimensionRanges = benchmark.dimensionRanges
    .filter(({dimensionId}) => dimensionId === typeID);

  const range = dimensionRanges
    .find(({maxScore: max, minScore: min}) => score >= min && score <= max);
  if(range.matchScore === 5) { return benchmark.hexColorLow; }
  if(range.matchScore === 10) { return benchmark.hexColorMedium; }
  if(range.matchScore === 20) { return benchmark.hexColorHigh; }

  return "black";
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

    const sortedData = _data.filter(({color}) => color === benchmark.hexColorLow);
    sortedData.push(..._data.filter(({color}) => color === benchmark.hexColorMedium));
    sortedData.push(..._data.filter(({color}) => color === benchmark.hexColorHigh));
    sortedData.push(..._data.filter(({color}) => color === "black"));

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
    hexColorLow: PropTypes.string.isRequired,
    hexColorMedium: PropTypes.string.isRequired,
    hexColorHigh: PropTypes.string.isRequired,
    dimensionRanges: PropTypes.shape({
      id: PropTypes.string.isRequired,
      dimensionId: PropTypes.string.isRequired,
      matchScore: PropTypes.number.isRequired,
      maxScore: PropTypes.number.isRequired,
      minScore: PropTypes.number.isRequired
    }).isRequired
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
export default withTraitify(Guide, {paradox: Paradox});
