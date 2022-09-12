import PropTypes from "prop-types";
import {Component} from "react";
import * as queries from "lib/graphql/queries";
import {getDisplayName, loadFont} from "lib/helpers";
import {dig} from "lib/helpers/object";
import TraitifyPropTypes from "lib/helpers/prop-types";
import themeAssessment from "lib/helpers/theme-assessment";

const fonts = {paradox: "https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700"};
const imagePacks = {paradox: "white"};

export default function withTraitify(WrappedComponent, themeComponents = {}) {
  return class TraitifyComponent extends Component {
    static displayName = `Traitify${getDisplayName(WrappedComponent)}`;
    static defaultProps = {
      assessment: null,
      assessmentID: null,
      benchmarkID: null,
      cache: null,
      locale: null,
      options: null,
      traitify: null,
      ui: null
    };
    static propTypes = {
      assessment: PropTypes.oneOfType([
        PropTypes.shape({ // Cognitive
          id: PropTypes.string.isRequired,
          locale_key: PropTypes.string,
          profile_ids: PropTypes.arrayOf(PropTypes.string.isRequired),
          questions: PropTypes.arrayOf(
            PropTypes.shape({id: PropTypes.string.isRequired}).isRequired
          ),
          recommendation: PropTypes.shape({recommendation_id: PropTypes.string})
        }),
        PropTypes.shape({ // Personality
          deck_id: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          locale_key: PropTypes.string,
          personality_types: PropTypes.arrayOf(
            PropTypes.shape({
              personality_type: PropTypes.shape({
                name: PropTypes.string.isRequired
              }).isRequired
            }).isRequired
          ).isRequired,
          profile_ids: PropTypes.arrayOf(PropTypes.string.isRequired),
          recommendation: PropTypes.shape({recommendation_id: PropTypes.string}),
          slides: PropTypes.arrayOf(PropTypes.shape({
            caption: PropTypes.string.isRequired
          }).isRequired)
        })
      ]),
      assessmentID: PropTypes.string,
      benchmarkID: PropTypes.string,
      cache: PropTypes.shape({
        get: PropTypes.func.isRequired,
        set: PropTypes.func.isRequired
      }),
      locale: PropTypes.string,
      options: PropTypes.shape({locale: PropTypes.string}),
      traitify: TraitifyPropTypes.traitify,
      ui: TraitifyPropTypes.ui
    };
    static getDerivedStateFromError(error) { return {error}; }
    constructor(props) {
      super(props);

      this.state = {
        assessment: null,
        assessmentID: null,
        benchmark: null,
        benchmarkID: null,
        deck: null,
        deckID: null,
        error: null,
        followingBenchmark: null,
        followingDeck: null,
        followingGuide: null,
        guide: null,
        locale: null,
        profileID: null
      };
      this.setupTraitify();
      this.setupCache();
      this.setupI18n();
      this.setAssessmentID();
      this.setBenchmarkID();
    }
    componentDidMount() {
      this.didMount = true;

      loadFont(fonts[this.getOption("theme")]);

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

      if(prevProps.benchmarkID !== this.props.benchmarkID) {
        this.setState({benchmarkID: this.props.benchmarkID});
      }

      const changes = {
        assessment: prevState.assessment !== this.state.assessment,
        assessmentID: prevState.assessmentID !== this.state.assessmentID,
        benchmark: prevState.benchmark !== this.state.benchmark,
        benchmarkID: prevState.benchmarkID !== this.state.benchmarkID,
        deck: prevState.deck && !this.state.deck,
        deckID: prevState.deckID !== this.state.deckID,
        locale: prevState.locale !== this.state.locale
      };

      if(changes.assessmentID || changes.locale) {
        this.updateAssessment({oldID: prevState.assessmentID, oldLocale: prevState.locale});
      }

      if(
        this.state.followingBenchmark
        && (changes.benchmark || changes.benchmarkID || changes.locale)
      ) {
        this.updateBenchmark({oldID: prevState.benchmarkID, oldLocale: prevState.locale});
      }

      if(this.state.followingDeck && (changes.deck || changes.deckID || changes.locale)) {
        this.updateDeck({oldID: prevState.deckID, oldLocale: prevState.locale});
      }

      if(this.state.followingGuide && (changes.assessment || changes.locale)) {
        this.updateGuide({oldID: prevState.assessment?.id, oldLocale: prevState.locale});
      }

      this.updateColorScheme(); // Performed every time to because React may remove side-effects
    }
    componentDidCatch(error, info) {
      this.ui.trigger("Component.error", this, {error, info});
    }
    componentWillUnmount() {
      Object.keys(this.listeners).forEach((key) => { this.removeListener(key); });
    }
    getAssessment = (options = {}) => {
      const {assessmentID, locale} = this.state;
      if(!assessmentID) { return Promise.resolve(); }

      const key = this.getCacheKey("assessment", {id: assessmentID});
      const hasResults = (data) => (
        data && data.locale_key
          && data.id === assessmentID
          && data.locale_key.toLowerCase() === locale
          && data.personality_types
          && data.personality_types.length > 0
      );
      const setAssessment = (_data) => {
        const data = themeAssessment({data: _data, theme: this.getOption("theme")});

        return new Promise((resolve) => {
          this.setState({assessment: data}, () => (resolve(data)));
          this.ui.trigger(key, this, data);
        });
      };

      let {assessment} = this.props;
      if(hasResults(assessment)) { return setAssessment(assessment); }

      assessment = this.cache.get(key);
      if(hasResults(assessment)) { return setAssessment(assessment); }

      if(this.ui.requests[key] && !options.force) { return this.ui.requests[key]; }

      const imagePack = imagePacks[this.getOption("theme")] || this.ui.options.imagePack;
      const params = {
        data: "archetype,blend,instructions,recommendation,slides,types,traits",
        locale_key: locale
      };

      if(imagePack) { params.image_pack = imagePack; }

      this.ui.requests[key] = this.traitify.get(
        `/assessments/${assessmentID}`,
        params
      ).then((data) => {
        if(hasResults(data)) { this.cache.set(key, data); }

        setAssessment(data);
      }).catch((error) => {
        console.warn(error); // eslint-disable-line no-console

        delete this.ui.requests[key];
      });

      return this.ui.requests[key];
    };
    getBenchmark = (options = {}) => {
      const {benchmarkID, locale} = this.state;
      if(!benchmarkID) { return Promise.resolve(); }
      const key = this.getCacheKey("benchmark");
      const hasData = (data) => (data && data.benchmarkId === benchmarkID && data.name);
      const setBenchmark = (data) => (
        new Promise((resolve) => {
          this.setState({benchmark: data}, () => (resolve(data)));
          this.ui.trigger(key, this, data);
        })
      );

      let {benchmark} = this.state;
      if(hasData(benchmark)) { return setBenchmark(benchmark); }

      benchmark = this.cache.get(key);
      if(hasData(benchmark)) { return setBenchmark(benchmark); }

      if(this.ui.requests[key] && !options.force) {
        return this.ui.requests[key];
      }

      const query = queries.benchmark({params: {benchmarkId: benchmarkID, localeKey: locale}});
      this.ui.requests[key] = this.traitify.post("/recommendations/graphql", query).then(({data}) => {
        const dimensionRangebenchmark = data.getDimensionRangeBenchmark;

        if(hasData(dimensionRangebenchmark)) {
          this.cache.set(key, dimensionRangebenchmark);

          setBenchmark(dimensionRangebenchmark);
        } else {
          delete this.ui.requests[key];
        }
      }).catch((error) => {
        console.warn(error); // eslint-disable-line no-console

        delete this.ui.requests[key];
      });

      return this.ui.requests[key];
    };
    getCacheKey = (type, options = {}) => {
      let {id} = options;
      const locale = options.locale || this.state.locale;
      const keys = [];

      // Add it to keys if something can't be identified from response data (like image pack)
      switch(type) {
        case "assessment":
          id = id || this.state.assessmentID;
          keys.push(imagePacks[this.getOption("theme")] || this.ui.options.imagePack);
          break;
        case "benchmark":
          id = id || this.state.benchmarkID;
          break;
        case "deck":
          id = id || this.state.deckID;
          break;
        default:
          id = id || this.state.assessmentID;
      }

      return [locale, type, id, ...keys].filter(Boolean).join(".");
    };
    getCognitiveAssessment = (options = {}) => {
      const {assessmentID, locale} = this.state;
      if(!assessmentID) { return Promise.resolve(); }

      const key = this.getCacheKey("cognitive-assessment");
      const hasResults = (data) => (
        data && data.localeKey
          && data.id === assessmentID
          && data.localeKey.toLowerCase() === locale
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
    };
    getDeck = (options = {}) => {
      const {deckID, locale} = this.state;
      if(!deckID) { return Promise.resolve(); }

      const key = this.getCacheKey("deck");
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
    };
    getGuide = (options = {}) => {
      const {assessment, locale} = this.state;
      const assessmentID = (assessment || {}).id;
      if(!assessmentID) { return Promise.resolve(); }

      const key = this.getCacheKey("guide", {id: assessmentID});
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
    };
    getListener = (key) => (this.listeners[key.toLowerCase()]);
    getOption = (...keys) => {
      const {props, ui} = this;

      if(keys.length > 1 && dig(props, ...keys.slice(1)) != null) {
        return dig(props, ...keys.slice(1));
      }
      if(dig(props, ...keys) != null) { return dig(props, ...keys); }
      if(dig(props.options, ...keys) != null) { return dig(props.options, ...keys); }
      if(ui && dig(ui.options, ...keys) != null) { return dig(ui.options, ...keys); }
    };
    setAssessmentID() {
      const assessmentID = this.getOption("assessmentID") || (
        this.props.assessment && this.props.assessment.id
      );

      if(assessmentID) { this.safeSetState({assessmentID}); }
    }
    setBenchmarkID() {
      const benchmarkID = this.getOption("benchmarkID");

      if(benchmarkID) { this.safeSetState({benchmarkID}); }
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
    addListener = (_key, callback) => {
      const key = _key.toLowerCase();

      this.listeners = this.listeners || {};
      this.listeners[key] = callback;
      this.ui.on(key, callback);
    };
    // setState method that also works in the constructor
    safeSetState = (state) => {
      if(this.didMount) {
        this.setState(state);
      } else {
        this.state = {...this.state, ...state};
      }
    };
    setElement = (element) => { this.setState({element}); };
    followBenchmark = () => {
      this.setState({followingBenchmark: true});
      this.updateBenchmark();
    };
    followDeck = () => {
      this.setState({followingDeck: true});
      this.updateDeck();
    };
    followGuide = () => {
      this.setState({followingGuide: true});
      this.updateGuide();
    };
    isReady = (type) => {
      const {assessment, benchmark, deck, guide} = this.state;

      if(this.getOption("surveyType") === "cognitive") {
        switch(type) {
          case "questions":
          case "slides":
            return !!(assessment && (assessment.questions || []).length > 0);
          case "results":
            return !!(assessment && assessment.completed);
          default:
            return false;
        }
      }

      switch(type) {
        case "benchmark":
          return !!(benchmark && benchmark.name && (benchmark.dimensionRanges || []).length > 0);
        case "deck":
          return !!(deck && deck.name);
        case "guide":
          return !!((guide && (guide.competencies || []).length > 0));
        case "results":
          return !!(assessment && (assessment.personality_types || []).length > 0);
        case "slides":
          return !!(assessment && (assessment.slides || []).length > 0);
        default:
          return false;
      }
    };
    removeListener = (_key) => {
      const key = _key.toLowerCase();

      this.ui.off(key, this.getListener(key));
      delete this.listeners[key];
    };
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
    updateAssessment(options = {}) {
      const {assessmentID, locale} = this.state;

      if(options.oldID || options.oldLocale) {
        const key = this.getCacheKey("assessment", {
          id: options.oldID || assessmentID,
          locale: options.oldLocale || locale
        });

        this.removeListener(key);
      }
      if(assessmentID) {
        const key = this.getCacheKey("assessment", {id: assessmentID, locale});

        this.addListener(key, (_, assessment) => {
          const newState = {
            assessment,
            assessmentID: assessment.id,
            assessmentType: assessment.assessment_type,
            deck: null,
            deckID: assessment.deck_id,
            profileID: assessment.profile_ids ? assessment.profile_ids[0] : null
          };

          if(!this.getOption("benchmarkID")) {
            const recommendation = assessment.recommendation
              || dig(assessment, "recommendations", 0)
              || {};

            newState.benchmark = null;
            newState.benchmarkID = recommendation.recommendation_id;
          }

          this.setState(newState);
        });

        const currentValue = this.ui.current[key];
        if(currentValue != null) {
          this.getListener(key)(null, currentValue);
        } else {
          this.getAssessment();
        }
      }
    }
    updateBenchmark(options = {}) {
      const {benchmarkID, locale} = this.state;

      if(options.oldID || options.oldLocale) {
        const key = this.getCacheKey("benchmark", {
          id: options.oldID || benchmarkID,
          locale: options.oldLocale || locale
        });

        this.removeListener(key);
      }

      if(!benchmarkID) { return; }

      const key = this.getCacheKey("benchmark", {id: benchmarkID, locale});

      this.addListener(key, (_, benchmark) => {
        this.setState({benchmark});
      });

      const currentValue = this.ui.current[key];
      if(currentValue != null) {
        this.getListener(key)(null, currentValue);
      } else {
        this.getBenchmark();
      }
    }
    updateCognitiveAssessment(options = {}) {
      const {assessmentID, locale} = this.state;

      if(options.oldID || options.oldLocale) {
        const key = this.getCacheKey("cognitive-assessment", {
          id: options.oldID || assessmentID,
          locale: options.oldLocale || locale
        });

        this.removeListener(key);
      }
      if(assessmentID) {
        const key = this.getCacheKey("cognitive-assessment", {id: assessmentID, locale});

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
    updateColorScheme() {
      const {element} = this.state;
      if(!element) { return; }

      const colorScheme = this.getOption("colorScheme") || "light";

      ["auto", "dark", "light"].forEach((scheme) => {
        const className = `traitify--color-scheme-${scheme}`;

        if(element.classList.contains(className)) {
          if(colorScheme !== scheme) { element.classList.remove(className); }
        } else {
          if(colorScheme === scheme) { element.classList.add(className); }
        }
      });
    }
    updateDeck(options = {}) {
      const {deckID, locale} = this.state;

      if(options.oldID || options.oldLocale) {
        const key = this.getCacheKey("deck", {
          id: options.oldID || deckID,
          locale: options.oldLocale || locale
        });

        this.removeListener(key);
      }
      if(deckID) {
        const key = this.getCacheKey("deck", {id: deckID, locale});

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
        const key = this.getCacheKey("guide", {
          id: options.oldID || assessmentID,
          locale: options.oldLocale || locale
        });

        this.removeListener(key);
      }

      if(!assessmentID) { return; }
      if(assessment.assessment_type !== "DIMENSION_BASED") { return; }

      const key = this.getCacheKey("guide", {id: assessmentID, locale});

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
        followBenchmark,
        followDeck,
        followGuide,
        getAssessment,
        getCacheKey,
        getCognitiveAssessment,
        getOption,
        isReady,
        props,
        setElement,
        state,
        traitify,
        ui
      } = this;

      const ThemeComponent = themeComponents[getOption("theme")] || WrappedComponent;
      const {i18n, options: {locale}} = ui;
      const translate = i18n.translate.bind(null, locale);
      const options = {
        ...props,
        ...state,
        cache,
        followBenchmark,
        followDeck,
        followGuide,
        getAssessment,
        getCacheKey,
        getCognitiveAssessment,
        getOption,
        locale,
        isReady,
        setElement,
        traitify,
        translate,
        ui
      };

      if(state.error) { return null; }

      return <ThemeComponent {...options} />;
    }
  };
}
