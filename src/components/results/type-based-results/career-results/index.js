import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import Career from "../career";
import style from "./style";

class CareerResults extends Component {
  static defaultProps = {options: null}
  static propTypes = {
    assessmentID: PropTypes.string.isRequired,
    isReady: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    options: PropTypes.shape({careerOptions: PropTypes.object}),
    traitify: TraitifyPropTypes.traitify.isRequired,
    translate: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  }
  constructor(props) {
    super(props);

    this.state = {
      careers: [],
      fetching: false,
      moreCareers: false
    };
  }
  componentDidMount() {
    this.props.ui.trigger("CareerResults.initialized", this);
    this.props.ui.on("Careers.fetch", this.fetch);
    this.props.ui.on("Careers.fetching", this.fetching);
    this.props.ui.on("Careers.mergeParams", this.mergeParams);
    this.props.ui.on("Careers.updateParams", this.updateParams);

    if(this.props.isReady("results") && !this.props.ui.current["Careers.fetch"]) {
      this.props.ui.trigger("Careers.fetch", this, {});
    }
  }
  componentDidUpdate(prevProps) {
    this.props.ui.trigger("CareerResults.updated", this);

    const assessmentChanged = this.props.assessmentID !== prevProps.assessmentID;
    const assessmentReady = this.props.isReady("results");
    const existingRequest = this.props.ui.current["Careers.fetch"];
    const localeChanged = this.props.locale !== prevProps.locale;

    if(assessmentReady && !existingRequest) {
      this.props.ui.trigger("Careers.fetch", this, {});
    } else if(assessmentReady && (assessmentChanged || localeChanged)) {
      this.abortExistingRequest();
      this.props.ui.trigger("Careers.fetching", this, false);
      this.props.ui.trigger("Careers.fetch", this, localeChanged ? existingRequest : {});
    } else if(assessmentChanged || localeChanged) {
      this.abortExistingRequest();
      this.props.ui.trigger("Careers.fetching", this, false);
      this.props.ui.trigger("Careers.fetch", this, null);
    }
  }
  componentWillUnmount() {
    this.props.ui.off("Careers.fetch", this.fetch);
    this.props.ui.off("Careers.fetching", this.fetching);
    this.props.ui.off("Careers.mergeParams", this.mergeParams);
    this.props.ui.off("Careers.updateParams", this.updateParams);

    this.abortExistingRequest();
    this.props.ui.trigger("Careers.fetching", this, false);
    this.props.ui.trigger("Careers.fetch", this, null);
  }
  abortExistingRequest = () => {
    if(this.props.ui.current["Careers.fetching"]) {
      const previousRequest = this.props.ui.current["Careers.request"];
      previousRequest && previousRequest.xhr && previousRequest.xhr.abort();
    }
  }
  careerOption = (name) => {
    if(this.props[name] != null) { return this.props[name]; }
    if(this.props.options
      && this.props.options.careerOptions
      && this.props.options.careerOptions[name] != null
    ) { return this.props.options.careerOptions[name]; }
    if(this.props.ui
      && this.props.ui.options.careerOptions
      && this.props.ui.options.careerOptions[name] != null
    ) { return this.props.ui.options.careerOptions[name]; }
  }
  fetch = () => {
    const fetchParams = this.props.ui.current["Careers.fetch"];

    if(!fetchParams) { return; }

    const path = this.careerOption("path") || `/assessments/${this.props.assessmentID}/matches/careers`;
    const params = {
      careers_per_page: this.careerOption("perPage") || 20,
      locale_key: this.props.locale,
      paged: true,
      ...fetchParams
    };

    this.abortExistingRequest();
    this.props.ui.trigger("Careers.fetching", this, true);
    this.props.ui.trigger(
      "Careers.request",
      this,
      this.props.traitify.get(path, params).then((response) => {
        this.setState((state) => {
          const previousCareers = (params.page > 1) ? state.careers : [];

          return {
            careers: previousCareers.concat(response),
            moreCareers: response.length >= params.careers_per_page
          };
        }, () => {
          this.props.ui.trigger("Careers.fetching", this, false);
        });
      })
    );
  }
  fetching = () => {
    this.setState({fetching: this.props.ui.current["Careers.fetching"]});
  }
  mergeParams = () => {
    this.props.ui.trigger("Careers.fetch", this, {
      ...this.props.ui.current["Careers.fetch"],
      ...this.props.ui.current["Careers.mergeParams"]
    });
  }
  showMore = () => {
    if(this.props.ui.current["Careers.fetching"]) { return; }
    const params = this.props.ui.current["Careers.fetch"] || {};
    const page = (params.page || 1) + 1;

    this.props.ui.trigger("Careers.mergeParams", this, {page});
  }
  updateParams = () => {
    this.props.ui.trigger("Careers.fetch", this, {
      ...this.props.ui.current["Careers.updateParams"]
    });
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    const {careers, fetching, moreCareers} = this.state;
    const {translate} = this.props;

    return (
      <div className={style.container}>
        {careers.map((_career) => {
          const {career, score} = _career;

          return <Career key={career.id} career={{score, ...career}} {...this.props} />;
        })}
        <p className={style.center}>
          {fetching && <span>{translate("loading")}</span>}
          {!fetching && [
            moreCareers && (
              <button key="more" className={style.more} onClick={this.showMore} type="button">{translate("show_more")}</button>
            ),
            (careers.length === 0 && <span key="none">{translate("no_careers")}</span>),
            (careers.length > 0 && !moreCareers && <span key="done">{translate("no_more_careers")}</span>)
          ]}
        </p>
      </div>
    );
  }
}

export {CareerResults as Component};
export default withTraitify(CareerResults);
