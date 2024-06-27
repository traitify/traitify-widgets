import {useMemo} from "react";
import dig from "lib/common/object/dig";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

const typesToStyles = (types) => (
  types.map((type) => (
    type.career_style.map((item) => ({
      alt: type.name,
      badge: type.badge,
      text: item
    }))
  )).reduce((all, list) => all.concat(list), [])
);

export default function PersonalityBaseStyles() {
  const disabled = useDisabledComponent("PersonalityStyles");
  const results = useResults();
  const showHeaders = useOption("showHeaders");
  const translate = useTranslate();
  const styles = useMemo(() => {
    const types = (dig(results, "personality_types") || [])
      .map(({personality_type: type, score}) => ({...type, score}))
      .filter((type) => dig(type, "career_style", 0));
    if(types.length === 0) { return null; }

    return {
      positive: typesToStyles(types.length > 3 ? types.slice(-2).reverse() : types.slice(-1)),
      negative: typesToStyles(types.length > 3 ? types.slice(0, 2) : [types[0]])
    };
  }, [results]);

  useComponentEvents("PersonalityStyles", {styles});

  if(disabled) { return null; }
  if(!styles) { return null; }

  return (
    <div className={style.container}>
      {showHeaders && <div className={style.sectionHeading}>{translate("headings.personality.styles.overall")}</div>}
      <div className={style.columns}>
        <div>
          <div className={style.heading}>{translate("headings.personality.styles.positive")}</div>
          <div className={style.styles}>
            {styles.positive.map(({alt, badge, text}) => (
              <div key={text} className={style.style}>
                {badge && <img alt={alt} src={badge.image_medium} />}
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={style.negative}>
          <div className={style.heading}>{translate("headings.personality.styles.negative")}</div>
          <div className={style.styles}>
            {styles.negative.map(({alt, badge, text}) => (
              <div key={text} className={style.style}>
                {badge && <img alt={alt} src={badge.image_medium} />}
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
