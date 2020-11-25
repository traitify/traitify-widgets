import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useDidMount, useDidUpdate} from "lib/helpers/hooks";
import Icon from "lib/helpers/icon";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

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
  const {assessment, followGuide, guide, isReady, translate, ui} = props;
  const competencies = dig(guide, ["competencies"]) || [];
  const types = dig(assessment, ["personality_types"]) || [];
  const data = competencies.map((competency) => {
    if(types.length === 0) { return competency; }

    const typeID = competency.questionSequences[0].personality_type_id;
    const {personality_type: {badge}, score} = types
      .find(({personality_type: {id}}) => id === typeID);
    let rank;

    switch(true) {
      case score <= 3: rank = "low"; break;
      case score <= 6: rank = "medium"; break;
      default: rank = "high";
    }

    return {...competency, badge: badge.image_medium, rank, score};
  }, {}).sort(({score: scoreA}, {score: scoreB}) => scoreA - scoreB);
  const [activeCompetency, setActiveCompetency] = useState(data[0]);
  const [showExpandedIntro, setShowExpandedIntro] = useState(false);
  const state = {activeCompetency, showExpandedIntro};

  useDidMount(() => { ui.trigger("Guide.initialized", {props, state}); });
  useDidMount(() => { followGuide(); });
  useDidUpdate(() => { ui.trigger("Guide.updated", {props, state}); });
  useEffect(() => {
    if(data.length === 0) { return; }

    setActiveCompetency(data[0]);
  }, [dig(assessment, ["id"]), dig(guide, ["assessment_id"]), dig(guide, ["locale_key"])]);

  if(!isReady("guide")) { return null; }
  if(!isReady("results")) { return null; }
  if(!activeCompetency) { return null; }
  if(competencies.length === 0) { return null; }

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
          {data.map(({badge, id, name, rank}) => {
            const classes = [
              style[rank],
              style.tab,
              id === activeCompetency.id && style.tabActive
            ].filter(Boolean);

            return (
              <li key={id} className={classes.join(" ")}>
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

Guide.defaultProps = {assessment: null, guide: null};
Guide.propTypes = {
  assessment: PropTypes.shape({
    assessment_type: PropTypes.string,
    personality_types: PropTypes.array
  }),
  followGuide: PropTypes.func.isRequired,
  guide: PropTypes.shape({
    assessment_id: PropTypes.string.isRequired,
    competencies: PropTypes.array.isRequired,
    locale_key: PropTypes.string.isRequired
  }),
  isReady: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};

export {Guide as Component};
export default withTraitify(Guide);
