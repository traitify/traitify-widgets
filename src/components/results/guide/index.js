import PropTypes from "prop-types";
import {Component} from "react";
import DangerousHTML from "lib/helpers/dangerous-html";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import CompetencySelect from "./competency-select";
import CompetencyTab from "./competency-tab";
import style from "./style.scss";

class Guide extends Component {
  static defaultProps = {assessment: null, guide: null}
  static propTypes = {
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
  }
  constructor(props) {
    super(props);
    this.state = {
      badges: [],
      competencies: [],
      displayedCompetency: null,
      showExpandedIntro: false
    };
  }
  componentDidMount() {
    this.props.ui.trigger("Guide.initialized", this);
    this.props.followGuide();
  }
  componentDidUpdate(prevProps) {
    this.props.ui.trigger("Guide.updated", this);

    const guide = this.props.guide || {};
    const prevGuide = prevProps.guide || {};
    const changes = {
      assessment: guide.assessment_id !== prevGuide.assessment_id,
      locale: guide.locale_key !== prevGuide.locale_key
    };

    if(changes.assessment || changes.locale) { this.setGuide(); }
  }
  setGuide() {
    if(!this.props.guide) {
      return this.setState({badges: [], competencies: [], displayedCompetency: null});
    }

    const {competencies} = this.props.guide;
    const badges = this.badges(competencies);

    this.setState({badges, competencies, displayedCompetency: {...competencies[0]}});
  }
  displayCompetency = (competencyID) => {
    this.setState(({competencies}) => {
      const displayedCompetency = competencies.find((competency) => competency.id === competencyID);

      return displayedCompetency && {displayedCompetency};
    });
  }
  tabBadge = (id) => (
    this.state.badges.find((badge) => badge.competencyID === id).image
  )
  toggleExpandedIntro = () => {
    this.setState((prevState) => ({showExpandedIntro: !prevState.showExpandedIntro}));
  }
  badges(competencies) {
    const {assessment} = this.props;

    return competencies.map((competency) => {
      const personalityID = competency.questionSequences[0].personality_type_id;
      const types = assessment.personality_types;
      const personality = types.find((type) => type.personality_type.id === personalityID);

      return {competencyID: competency.id, image: personality.personality_type.badge.image_medium};
    });
  }
  introduction() {
    const {introduction} = this.state.displayedCompetency;
    const intro = introduction.split("\n", 1)[0];
    const readMore = introduction.replace(intro, "").trim();

    return {intro, readMore};
  }
  stringToListItems(entity) {
    let entities = entity.split("\n");
    /* eslint-disable-next-line react/no-array-index-key */
    entities = entities.map((e, i) => <li key={i}>{e}</li>);

    return (<ul>{entities}</ul>);
  }
  render() {
    if(!this.props.isReady("guide")) { return null; }
    if(!this.props.isReady("results")) { return null; }
    if(this.state.competencies.length === 0) { return null; }

    const {translate} = this.props;
    const {competencies, displayedCompetency, showExpandedIntro} = this.state;
    const {intro, readMore} = this.introduction();

    return (
      <div className={style.tabsContainer}>
        <div className={style.tabContainer}>
          <CompetencySelect
            competencies={competencies}
            displayedCompetency={displayedCompetency}
            displayCompetency={this.displayCompetency}
            tabBadge={this.tabBadge}
          />
          <ul className={style.tabs}>
            {competencies.map((competency) => (
              <CompetencyTab
                key={competency.id}
                competency={competency}
                displayedCompetency={displayedCompetency}
                displayCompetency={this.displayCompetency}
                tabBadge={this.tabBadge}
              />
            ))}
          </ul>
        </div>
        <div className={style.tabsContent}>
          <div className={style.tabContentActive}>
            <h2>{displayedCompetency.name}</h2>
            {intro}
            <p>
              <button
                type="button"
                onClick={this.toggleExpandedIntro}
              >
                {translate("read_more")}
              </button>
            </p>
            {showExpandedIntro && (<p>{readMore}</p>)}
            <hr />
            {displayedCompetency.questionSequences.map((sequence) => (
              <div key={sequence.id}>
                <h2>{sequence.name}</h2>
                <p>{translate("guide_intro")}</p>
                <p><DangerousHTML html={translate("guide_get_started_html")} tag="em" /></p>
                {sequence.questions.map((question) => (
                  <div key={question.id}>
                    <h3 id={question.order === 1 ? "traitify-question-1" : null}>{`Question ${question.order}`}</h3>
                    <p>{question.text}</p>
                    <h4>{translate("question_purpose")}</h4>
                    <div>{this.stringToListItems(question.purpose)}</div>
                    {question.adaptability && (
                      <div>
                        <h4>{translate("question_adaptability")}</h4>
                        <div>{this.stringToListItems(question.adaptability)}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export {Guide as Component};
export default withTraitify(Guide);
