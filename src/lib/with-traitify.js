import PropTypes from "prop-types";
import {Component} from "react";
import * as queries from "lib/graphql/queries";
import {getDisplayName, loadFont} from "lib/helpers";
import TraitifyPropTypes from "lib/helpers/prop-types";

export default function withTraitify(WrappedComponent) {
  return class TraitifyComponent extends Component {
    static displayName = `Traitify${getDisplayName(WrappedComponent)}`
    static defaultProps = {
      assessment: null,
      assessmentID: null,
      cache: null,
      locale: null,
      options: null,
      traitify: null,
      ui: null
    }
    static propTypes = {
      assessment: PropTypes.shape({
        deck_id: PropTypes.string,
        id: PropTypes.string,
        locale_key: PropTypes.string,
        personality_types: PropTypes.array,
        slides: PropTypes.array
      }),
      assessmentID: PropTypes.string,
      cache: PropTypes.shape({
        get: PropTypes.func.isRequired,
        set: PropTypes.func.isRequired
      }),
      locale: PropTypes.string,
      options: PropTypes.shape({locale: PropTypes.string}),
      traitify: TraitifyPropTypes.traitify,
      ui: TraitifyPropTypes.ui
    }
    constructor(props) {
      super(props);

      this.state = {
        assessment: null,
        assessmentID: null,
        deck: null,
        deckID: null,
        error: null,
        followingDeck: null,
        followingGuide: null,
        guide: null,
        locale: null
      };
      this.setupTraitify();
      this.setupCache();
      this.setupI18n();
      this.setAssessmentID();
    }
    componentDidMount() {
      this.didMount = true;

      loadFont();

      if(this.getOption("surveyType") === "cognitive") { return this.updateCognitiveAssessment(); }

      this.updateAssessment();
    }
    componentDidUpdate(prevProps, prevState) {
      const newAssessment = this.props.assessment || {};
      const oldAssessment = prevProps.assessment || {};

      if(oldAssessment.id !== newAssessment.id) {
        this.setState({assessmentID: newAssessment.id});
      } else if(prevProps.assessmentID !== this.props.assessmentID) {
        this.setState({assessmentID: this.props.assessmentID});
      }

      if(this.getOption("surveyType") === "cognitive") { return this.cognitiveDidUpdate(prevProps, prevState); }

      const changes = {
        assessmentID: prevState.assessmentID !== this.state.assessmentID,
        deckID: prevState.deckID !== this.state.deckID,
        locale: prevState.locale !== this.state.locale
      };

      if(changes.assessmentID || changes.locale) {
        this.updateAssessment({oldID: prevState.assessmentID, oldLocale: prevState.locale});
      }

      if(this.state.followingDeck && (changes.deckID || changes.locale)) {
        this.updateDeck({oldID: prevState.deckID, oldLocale: prevState.locale});
      }

      if(this.state.followingGuide) {
        const oldAssessmentState = prevState.assessment || {};
        const oldAssessmentID = oldAssessmentState.id;
        const newAssessmentState = this.state.assessment || {};
        const assessmentChanged = oldAssessmentID !== newAssessmentState.id;
        const oldAssessmentTypes = oldAssessmentState.personality_types || [];
        const newAssessmentTypes = newAssessmentState.personality_types || [];
        changes.results = oldAssessmentTypes.length !== newAssessmentTypes.length;

        if(assessmentChanged || changes.locale || changes.results) {
          this.updateGuide({oldID: oldAssessmentID, oldLocale: prevState.locale});
        }
      }
    }
    componentWillUnmount() {
      Object.keys(this.listeners).forEach((key) => { this.removeListener(key); });
    }
    componentDidCatch(error, info) {
      this.ui.trigger("Component.error", this, {error, info});
      this.setState({error});
    }
    addListener = (_key, callback) => {
      const key = _key.toLowerCase();

      this.listeners = this.listeners || {};
      this.listeners[key] = callback;
      this.ui.on(key, callback);
    }
    // setState method that also works in the constructor
    safeSetState = (state) => {
      if(this.didMount) {
        this.setState(state);
      } else {
        this.state = {...this.state, ...state};
      }
    }
    cognitiveDidUpdate(prevProps, prevState) {
      const changes = {
        assessmentID: prevState.assessmentID !== this.state.assessmentID,
        locale: prevState.locale !== this.state.locale
      };

      if(changes.assessmentID || changes.locale) {
        this.updateCognitiveAssessment({
          oldID: prevState.assessmentID,
          oldLocale: prevState.locale
        });
      }
    }
    followDeck = () => {
      this.setState({followingDeck: true});
      this.updateDeck();
    }
    followGuide = () => {
      this.setState({followingGuide: true});
      this.updateGuide();
    }
    getAssessment = (options = {}) => {
      const {assessmentID, locale} = this.state;
      if(!assessmentID) { return Promise.resolve(); }

      const key = `${locale}.assessment.${assessmentID}`;
      const hasResults = (data) => (
        data && data.locale_key
          && data.id === assessmentID
          && data.locale_key.toLowerCase() === locale
          && data.personality_types
          && data.personality_types.length > 0
      );
      const setAssessment = (data) => (
        new Promise((resolve) => {
          this.setState({assessment: data}, () => (resolve(data)));
          this.ui.trigger(key, this, data);
        })
      );

      let {assessment} = this.props;
      if(hasResults(assessment)) { return setAssessment(assessment); }

      assessment = this.cache.get(key);
      if(hasResults(assessment)) { return setAssessment(assessment); }

      if(this.ui.requests[key] && !options.force) {
        return this.ui.requests[key];
      }

      this.ui.requests[key] = this.traitify.get(`/assessments/${assessmentID}`, {
        data: "archetype,blend,instructions,slides,types,traits",
        locale_key: locale
      }).then((data) => {
        if(hasResults(data)) { this.cache.set(key, data); }

        setAssessment(data);
      }).catch((error) => {
        console.warn(error); // eslint-disable-line no-console

        delete this.ui.requests[key];
      });

      return this.ui.requests[key];
    }
    getCognitiveAssessment = (options = {}) => {
      const {assessmentID, locale} = this.state;
      if(!assessmentID) { return Promise.resolve(); }

      const key = `${locale}.cognitive-assessment.${assessmentID}`;
      // TODO: personality_types => ?
      const hasResults = (data) => (
        data && data.locale_key
          && data.id === assessmentID
          && data.locale_key.toLowerCase() === locale
          && data.completed
      );
      const setAssessment = (data) => (
        new Promise((resolve) => {
          this.setState({assessment: data}, () => (resolve(data)));
          this.ui.trigger(key, this, data);
        })
      );

      let {assessment} = this.props;
      if(hasResults(assessment)) { return setAssessment(assessment); }

      assessment = this.cache.get(key);
      if(hasResults(assessment)) { return setAssessment(assessment); }

      if(this.ui.requests[key] && !options.force) {
        return this.ui.requests[key];
      }

      const query = queries.cognitive.get({
        params: {localeKey: locale, testId: assessmentID}
      });

      this.ui.requests[key] = this.traitify.post(
        "/cognitive-tests/graphql",
        query
      ).then(({data: {cognitiveTest: data}}) => {
        if(hasResults(data)) { this.cache.set(key, data); }

        setAssessment(data);
      }).catch((error) => {
        console.warn(error); // eslint-disable-line no-console

        delete this.ui.requests[key];
      });

      return this.ui.requests[key];
    }
    getDeck = (options = {}) => {
      const {deckID, locale} = this.state;
      if(!deckID) { return Promise.resolve(); }

      const key = `${locale}.deck.${deckID}`;
      const hasData = (data) => (
        data && data.locale_key
          && data.id === deckID
          && data.locale_key.toLowerCase() === locale
          && data.name
      );
      const setDeck = (data) => (
        new Promise((resolve) => {
          this.setState({deck: data}, () => (resolve(data)));
          this.ui.trigger(key, this, data);
        })
      );

      let {deck} = this.state;
      if(hasData(deck)) { return setDeck(deck); }

      deck = this.cache.get(key);
      if(hasData(deck)) { return setDeck(deck); }

      if(this.ui.requests[key] && !options.force) {
        return this.ui.requests[key];
      }

      this.ui.requests[key] = this.traitify.get(`/decks/${deckID}`, {
        locale_key: locale
      }).then((_data) => {
        const data = {..._data};
        if(data && !data.locale_key) { data.locale_key = locale; }
        if(hasData(data)) { this.cache.set(key, data); }

        setDeck(data);
      }).catch((error) => {
        console.warn(error); // eslint-disable-line no-console

        delete this.ui.requests[key];
      });

      return this.ui.requests[key];
    }
    getGuide = (options = {}) => {
      const {assessment, locale} = this.state;
      const assessmentID = (assessment || {}).id;
      if(!assessmentID) { return Promise.resolve(); }

      const key = `${locale}.guide.${assessmentID}`;
      const hasData = (data) => (
        data && data.locale_key
          && data.assessment_id === assessmentID
          && data.locale_key.toLowerCase() === locale
          && data.competencies
          && data.competencies.length > 0
      );
      const setGuide = (data) => (
        new Promise((resolve) => {
          this.setState({guide: data}, () => (resolve(data)));
          this.ui.trigger(key, this, data);
        })
      );

      let {guide} = this.state;
      if(hasData(guide)) { return setGuide(guide); }

      guide = this.cache.get(key);
      if(hasData(guide)) { return setGuide(guide); }

      if(this.ui.requests[key] && !options.force) {
        return this.ui.requests[key];
      }

      const query = {...this.getOption("guideQuery") || {}};
      query.params = {...query.params, assessmentId: assessmentID, localeKey: locale};

      this.ui.requests[key] = this.traitify.post(
        "/interview_guides/graphql",
        queries.guide(query)
      ).then((_data) => {
        const _guide = (_data.data || {}).guide;
        const data = {..._guide};
        if(!data.assessment_id) { data.assessment_id = assessmentID; }
        if(!data.locale_key) { data.locale_key = locale; }
        if(hasData(data)) {
          this.cache.set(key, data);
          setGuide(data);
        } else {
          delete this.ui.requests[key];
        }
      }).catch((error) => {
        console.warn(error); // eslint-disable-line no-console

        delete this.ui.requests[key];
      });

      return this.ui.requests[key];
    }
    getListener = (key) => (this.listeners[key.toLowerCase()])
    getOption = (name) => {
      const {props, ui} = this;
      const {[name]: prop, options} = props;

      if(prop != null) { return prop; }
      if(options && options[name] != null) { return options[name]; }
      if(ui && ui.options[name] != null) { return ui.options[name]; }
    }
    isReady = (type) => {
      const {assessment, deck, guide} = this.state;

      switch(type) {
        case "deck":
          return !!((deck && !!deck.name));
        case "guide":
          return !!((guide && (guide.competencies || []).length > 0));
        case "questions":
          return !!(assessment && (assessment.questions || []).length > 0);
        case "results":
          return !!(assessment && (assessment.personality_types || []).length > 0);
        case "slides":
          return !!(assessment && (assessment.slides || []).length > 0);
        default:
          return false;
      }
    }
    removeListener = (_key) => {
      const key = _key.toLowerCase();

      this.ui.off(key, this.getListener(key));
      delete this.listeners[key];
    }
    setAssessmentID() {
      const assessmentID = this.getOption("assessmentID") || (
        this.props.assessment && this.props.assessment.id
      );

      if(assessmentID) { this.safeSetState({assessmentID}); }
    }
    setupCache() {
      this.cache = this.props.cache || {
        get(key) {
          try {
            const data = sessionStorage.getItem(key);

            return data ? JSON.parse(data) : null;
          } catch(error) { return null; }
        },
        set(key, data) {
          try {
            return sessionStorage.setItem(key, JSON.stringify(data));
          } catch(error) { return null; }
        }
      };
    }
    setupI18n() {
      this.addListener("I18n.setLocale", (_, locale) => {
        this.safeSetState({locale: locale.toLowerCase()});
      });

      const {locale: propLocale, options} = this.props;
      const locale = propLocale || (options && options.locale);
      if(locale && locale.toLowerCase() !== this.ui.options.locale) {
        this.ui.setLocale(locale.toLowerCase());
      } else {
        this.safeSetState({locale: this.ui.options.locale});
      }
    }
    setupTraitify() {
      const {traitify, ui} = this.props;

      this.traitify = traitify || (ui && ui.traitify) || window.Traitify;

      if(!this.traitify) { throw new Error("Traitify must be passed as a prop or attached to window"); }

      this.ui = ui || this.traitify.ui;
    }
    updateAssessment(options = {}) {
      const {assessmentID, locale} = this.state;

      if(options.oldID || options.oldLocale) {
        const oldAssessmentID = options.oldID || assessmentID;
        const oldLocale = options.oldLocale || locale;
        const key = `${oldLocale}.assessment.${oldAssessmentID}`;

        this.removeListener(key);
      }
      if(assessmentID) {
        const key = `${locale}.assessment.${assessmentID}`;

        this.addListener(key, (_, assessment) => {
          this.setState({
            assessment,
            assessmentID: assessment.id,
            assessmentType: assessment.assessment_type,
            deck: null,
            deckID: assessment.deck_id
          });
        });

        const currentValue = this.ui.current[key];
        if(currentValue != null) {
          this.getListener(key)(null, currentValue);
        } else {
          this.getAssessment();
        }
      }
    }
    updateCognitiveAssessment(options = {}) {
      const {assessmentID, locale} = this.state;

      if(options.oldID || options.oldLocale) {
        const oldAssessmentID = options.oldID || assessmentID;
        const oldLocale = options.oldLocale || locale;
        const key = `${oldLocale}.cognitive-assessment.${oldAssessmentID}`;

        this.removeListener(key);
      }
      if(assessmentID) {
        const key = `${locale}.cognitive-assessment.${assessmentID}`;

        this.addListener(key, (_, assessment) => {
          this.setState({
            assessment,
            assessmentID: assessment.id
          });
        });

        const currentValue = this.ui.current[key];
        if(currentValue != null) {
          this.getListener(key)(null, currentValue);
        } else {
          this.getCognitiveAssessment();
        }
      }
    }
    updateDeck(options = {}) {
      const {deckID, locale} = this.state;

      if(options.oldID || options.oldLocale) {
        const oldDeckID = options.oldID || deckID;
        const oldLocale = options.oldLocale || locale;
        const key = `${oldLocale}.deck.${oldDeckID}`;

        this.removeListener(key);
      }
      if(deckID) {
        const key = `${locale}.deck.${deckID}`;

        this.addListener(key, (_, deck) => {
          this.setState({deck});
        });

        const currentValue = this.ui.current[key];
        if(currentValue != null) {
          this.getListener(key)(null, currentValue);
        } else {
          this.getDeck();
        }
      }
    }
    updateGuide(options = {}) {
      const {assessment, locale} = this.state;
      const assessmentID = (assessment || {}).id;

      if(options.oldID || options.oldLocale) {
        const oldAssessmentID = options.oldID || assessmentID;
        const oldLocale = options.oldLocale || locale;
        const key = `${oldLocale}.guide.${oldAssessmentID}`;

        this.removeListener(key);
      }

      if(!assessmentID) { return; }
      if(assessment.assessment_type !== "DIMENSION_BASED") { return; }

      const key = `${locale}.guide.${assessmentID}`;

      this.addListener(key, (_, guide) => {
        this.setState({guide});
      });

      const currentValue = this.ui.current[key];
      if(currentValue != null) {
        this.getListener(key)(null, currentValue);
      } else {
        this.getGuide();
      }
    }
    render() {
      const {
        cache,
        followDeck,
        followGuide,
        getAssessment,
        getOption,
        isReady,
        props,
        state,
        traitify,
        ui
      } = this;

      const {i18n, options: {locale}} = ui;
      const translate = i18n.translate.bind(null, locale);
      const options = {
        ...props,
        ...state,
        cache,
        followDeck,
        followGuide,
        getAssessment,
        getOption,
        locale,
        isReady,
        traitify,
        translate,
        ui
      };

      return <WrappedComponent {...options} />;
    }
  };
}
