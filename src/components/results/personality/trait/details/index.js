import PropTypes from "prop-types";
import {useEffect} from "react";
import useComponentEvents from "lib/hooks/use-component-events";
import style from "./style.scss";

function PersonalityTraitDetails({trait: {personality_trait: trait, score: _score}}) {
  const type = trait.personality_type;

  useComponentEvents("PersonalityTrait");
  useEffect(() => {
    if(type) { return; }

    console.warn("Type missing on trait", trait); /* eslint-disable-line no-console */
  });

  if(!type) { return null; }

  const color = `#${type.badge.color_1}`;
  const score = Math.round(_score * 0.5 + 50);

  return (
    <div className={style.container}>
      <div className={style.bar} style={{background: color, width: `${score}%`}} />
      <div className={style.content}>
        <img alt={type.name} src={type.badge.image_medium} />
        <div className={style.heading}>
          {trait.name}
          <span className={style.description}>{trait.definition}</span>
        </div>
        <div className={style.score}>{score}%</div>
      </div>
    </div>
  );
}

PersonalityTraitDetails.propTypes = {
  trait: PropTypes.shape({
    personality_trait: PropTypes.shape({
      definition: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      personality_type: PropTypes.shape({
        badge: PropTypes.shape({
          color_1: PropTypes.string.isRequired,
          image_medium: PropTypes.string.isRequired
        }),
        name: PropTypes.string.isRequired
      })
    }).isRequired,
    score: PropTypes.number.isRequired
  }).isRequired
};

export default PersonalityTraitDetails;
