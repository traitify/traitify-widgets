import PropTypes from "prop-types";
import TraitifyPropTypes from "lib/helpers/prop-types";
import {Component} from "react";
import withTraitify from "lib/with-traitify";
import guideQuery from "lib/graphql/queries/guide";
import {dangerousProps} from "lib/helpers";
import smallScreen from "./helpers/helpers";
import style from "./style";

class Guide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      badges: [],
      competencies: [],
      displayedCompetency: {},
      errors: [],
      expandedIntro: false
    };
  }
  static defaultProps = {assessment: null, assessmentID: null}
  static propTypes = {
    assessment: PropTypes.shape({personality_types: PropTypes.array}),
    assessmentID: PropTypes.string,
    locale: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    traitify: TraitifyPropTypes.traitify.isRequired
  }
  componentDidMount() {
    this.setGuide();
  }
  componentDidUpdate(prevProps) {
    if(this.props.locale !== prevProps.locale) {
      this.setGuide();
    }

    if(this.props.assessmentID !== prevProps.assessmentID) {
      this.setGuide();
    }
  }
  adaptability(adaptability) {
    if(!adaptability) { return; }
    const {translate} = this.props;

    return (
      <div>
        <h4>{translate("question_adaptability")}</h4>
        <div>{this.stringToListItems(adaptability)}</div>
      </div>
    );
  }
  displayCompetency(competency) {
    const competencyName = typeof (competency) === "string" ? competency : competency.target.value;
    this.state.competencies.forEach((comp) => {
      if(competencyName === comp.name) {
        this.setState({displayedCompetency: comp});
      }
    });
  }
  expandedIntro(text) {
    if(this.state.expandedIntro) {
      return (
        <p>{text}</p>
      );
    }
  }
  handleReadMore() {
    this.setState((prevState) => ({expandedIntro: !prevState.expandedIntro}));
  }
  introduction() {
    const {introduction} = this.state.displayedCompetency;

    const intro = introduction.split("\n", 1)[0];
    const readMore = introduction.replace(intro, "").trim();
    return {intro, readMore};
  }
  selectBoxOrTabs() {
    const {displayedCompetency} = this.state;

    if(smallScreen()) {
      return (
        <div>
          <select
            value={displayedCompetency.name}
            className={style.mobileSelect}
            onChange={(e) => this.displayCompetency(e)}
          >
            {this.state.competencies.map((competency) => (
              <option value={competency.name}>{competency.name}</option>
            ))
            }
          </select>
          <p className={style.mobileBadge}>
            <img src={this.tabBadge(displayedCompetency.name)} alt={`${displayedCompetency.name} badge`} />
          </p>
        </div>
      );
    } else {
      return (
        <ul className={style.tabs}>
          {this.state.competencies.map((competency, index) => (
            <li
              className={competency.name === displayedCompetency.name ? style.tabActive : null}
              key={competency.id}
            >
              <button
                href={`#tab-${index}`}
                tabIndex={0}
                onKeyPress={() => this.displayCompetency(competency.name)}
                onClick={() => this.displayCompetency(competency.name)}
                name={competency.name}
                type="button"
              >
                <img src={this.tabBadge(competency.name)} alt={`${competency.name} badge`} />
                <br />
                {competency.name}
              </button>
            </li>
          ))}
        </ul>
      );
    }
  }
  setGuide() {
    const params = {assessmentId: this.props.assessmentID, localeKey: this.props.locale};
    this.props.traitify.graphqlQuery("/interview_guides/graphql", guideQuery({params}))
      .then((response) => {
        if(response.errors) {
          this.setState({errors: response.errors});
          return;
        }
        const {competencies} = response.data.guide;
        const badges = this.badges(competencies);
        this.setState({badges, competencies, displayedCompetency: competencies[0]});
      });
  }
  badges(competencies) {
    const {assessment} = this.props;

    return competencies.map((competency) => {
      const personalityId = competency.questionSequences[0].personality_type_id;
      const types = assessment.personality_types;
      const personality = types.filter((type) => type.personality_type.id === personalityId)[0];
      return {image: personality.personality_type.badge.image_medium, name: competency.name};
    });
  }
  stringToListItems(entity) {
    let entities = entity.split("\n");
    /* eslint-disable-next-line react/no-array-index-key */
    entities = entities.map((e, i) => <li key={i}>{e}</li>);

    return (
      <ul>
        {entities}
      </ul>
    );
  }
  tabBadge(tab) {
    return this.state.badges.filter((badge) => badge.name === tab)[0].image;
  }
  render() {
    if(this.state.errors.length > 0) { return <div />; }
    if(this.state.competencies.length === 0) { return <div />; }
    if(!this.props.assessment) { return <div />; }

    const {displayedCompetency} = this.state;
    const {translate} = this.props;
    const {intro, readMore} = this.introduction();

    return (
      <div className={style.tabsContainer}>
        <div className={style.tabContainer}>
          {this.selectBoxOrTabs()}
        </div>

        <div className={style.tabsContent}>
          <div className={style.tabContentActive}>
            <h2>{displayedCompetency.name}</h2>
            {intro}
            <p>
              <button
                href="#read-more"
                type="button"
                tabIndex={0}
                onClick={() => this.handleReadMore()}
                onKeyPress={() => this.handleReadMore()}
              >
                {translate("read_more")}
              </button>
            </p>
            {this.expandedIntro(readMore)}
            <hr />
            {displayedCompetency.questionSequences.map((sequence) => (
              <div key={sequence.id}>
                <h2>{sequence.name}</h2>
                <p>{translate("guide_intro")}</p>
                <p><em {...dangerousProps({html: translate("guide_get_started_html")})} /></p>
                {sequence.questions.map((question) => (
                  <div key={question.id}>
                    <h3 id={question.order === 1 ? "traitify-question-1" : null}>{`Question ${question.order}`}</h3>
                    <p>{question.text}</p>
                    <h4>{translate("question_purpose")}</h4>
                    <div>{this.stringToListItems(question.purpose)}</div>
                    {this.adaptability(question.adaptability)}
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
