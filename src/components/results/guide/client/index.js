import {useEffect, useMemo, useState} from "react";
import Markdown from "components/common/markdown";
import dig from "lib/common/object/dig";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useGuide from "lib/hooks/use-guide";
import Sequence from "./sequence";
import style from "./style.scss";

export default function ClientGuide() {
  const [activeSection, setActiveSection] = useState(null);
  const disabled = useDisabledComponent("Guide", "ClientGuide");
  const guide = useGuide();
  const sections = useMemo(() => dig(guide, "client", "sections") || [], [guide]);

  useComponentEvents("ClientGuide", {activeSection});
  useEffect(() => { setActiveSection(sections[0]); }, [sections]);

  if(disabled) { return null; }
  if(!activeSection) { return null; }

  const showSection = (newID) => setActiveSection(sections.find(({id}) => newID === id));
  const onChange = ({target: {value}}) => showSection(value);

  return (
    <div className={style.container}>
      <div className={style.heading}>{guide.client.title}</div>
      <Markdown>{guide.client.introduction || ""}</Markdown>
      <div className={style.tabs}>
        {sections.map(({id, title}) => (
          <button
            key={id}
            className={[id === activeSection.id && style.active].filter(Boolean).join(" ")}
            onClick={() => showSection(id)}
            type="button"
          >
            <span>{title}</span>
          </button>
        ))}
      </div>
      <div className={style.content}>
        <select className={style.dropdown} onChange={onChange} value={activeSection.id}>
          {sections.map(({id, title}) => <option key={id} value={id}>{title}</option>)}
        </select>
        <div className={style.heading}>{activeSection.title}</div>
        <Markdown>{activeSection.introduction || ""}</Markdown>
        {activeSection.questionSequences.map((sequence, index) => (
          <Sequence key={sequence.id} index={index} sequence={sequence} />
        ))}
      </div>
    </div>
  );
}
