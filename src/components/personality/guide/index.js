import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import Markdown from "components/common/markdown";
import {combine} from "lib/common/combine-data";
import dig from "lib/common/object/dig";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useBenchmark from "lib/hooks/use-benchmark";
import useGuide from "lib/hooks/use-guide";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import Question from "./question";
import style from "./style.scss";

function Guide({combined}) {
  const [activeCompetency, setActiveCompetency] = useState(null);
  const benchmark = useBenchmark();
  const [data, setData] = useState([]);
  const disabled = useDisabledComponent("InterviewGuide");
  const guide = useGuide();
  const results = useResults();
  const [showExpandedIntro, setShowExpandedIntro] = useState(false);
  const translate = useTranslate();

  useComponentEvents("Guide", {activeCompetency});
  useEffect(() => {
    const competencies = dig(guide, "competencies") || [];
    const types = dig(results, "personality_types") || [];
    if(competencies.length === 0 || types.length === 0) { return; }

    const _data = combine({benchmark, guide, order: "types", types})
      .map(({competency, rank, score, type}) => ({...competency, rank, score, type}));

    setData(_data);
    setActiveCompetency(_data[0]);
  }, [benchmark, guide, results]);

  if(disabled) { return null; }
  if(!activeCompetency) { return null; }

  const showCompetency = (newID) => setActiveCompetency(data.find(({id}) => newID === id));
  const [intro, ...expandedIntro] = activeCompetency.introduction.split("\n\n\n");
  const onChange = ({target: {value}}) => showCompetency(value);

  return (
    <div className={[style.container, combined && style.combined].filter(Boolean).join(" ")}>
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

Guide.defaultProps = {combined: false};
Guide.propTypes = {combined: PropTypes.bool};

export default Guide;
