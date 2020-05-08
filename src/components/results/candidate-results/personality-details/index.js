import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

class PersonalityDetails extends Component {
  static defaultProps = {assessment: null}
  static propTypes = {
    assessment: PropTypes.shape({archetype: PropTypes.object}),
    getOption: PropTypes.func.isRequired,
    isReady: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  componentDidMount() {
    this.props.ui.trigger("PersonalityDetails.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("PersonalityDetails.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const personality = this.props.assessment.archetype || {};
    const {details} = personality;
    if(!details) { return null; }
    const disabledComponents = this.props.getOption("disabledComponents") || [];
    let disableSettings = disabledComponents.includes("PersonalitySettings");
    let disableTools = disabledComponents.includes("PersonalityTools");
    const perspective = this.props.getOption("perspective") || "firstPerson";

    let settings;
    let settingsHeader;
    let tools;
    let cautions;
    if(perspective === "firstPerson") {
      settingsHeader = this.props.translate("candidate_heading_for_settings");
      settings = details.filter(({title}) => (title === "Settings that Work for You")).map(({body}) => body);
      tools = details.filter(({title}) => (title === "Tools to Use")).map(({body}) => body);
      cautions = details.filter(({title}) => (title === "Caution Zone")).map(({body}) => body);
    } else {
      settingsHeader = this.props.translate("candidate_heading_for_settings_third_person");
      settings = details.filter(({title}) => (title === "Third Person Settings that Work for Them")).map(({body}) => body);
      tools = details.filter(({title}) => (title === "Third Person Tools to Use")).map(({body}) => body);
      cautions = details.filter(({title}) => (title === "Third Person Caution Zone")).map(({body}) => body);
    }

    if(settings.length === 0) { disableSettings = true; }
    if(tools.length === 0) { disableTools = true; }
    if(disableSettings && disableTools) { return null; }
    let detailClass;
    [!disableTools, perspective === "thirdPerson", !disableSettings].filter(Boolean).length > 2 ? (
      detailClass = style.detail
    ) : (
      detailClass = style.detailColumn
    );

    return (
      <div className={style.container}>
        {!disableTools && (
          <div className={detailClass}>
            <div className={style.content}>
              <div className={style.bar} style={{background: "#008dc7"}} />
              <h4 className={style.title} style={{color: "#008dc7"}}>{this.props.translate("candidate_heading_for_tools")}</h4>
              <ul className={style.description}>
                {tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {perspective === "thirdPerson" && (
          <div className={detailClass}>
            <div className={style.content}>
              <div className={style.bar} style={{background: "#ef615e"}} />
              <h4 className={style.title} style={{color: "#ef615e"}}>{this.props.translate("caution_zone")}</h4>
              <ul className={style.description}>
                {cautions.map((caution) => (
                  <li key={caution}>{caution}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {!disableSettings && (
          <div className={detailClass}>
            <div className={style.content}>
              <div className={style.bar} style={{background: "#32be4b"}} />
              <h4 className={style.title} style={{color: "#32be4b"}}>{settingsHeader}</h4>
              <ul className={style.description}>
                {settings.map((setting) => (
                  <li key={setting}>{setting}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className={style.clearfix} />
      </div>
    );
  }
}

export {PersonalityDetails as Component};
export default withTraitify(PersonalityDetails);
