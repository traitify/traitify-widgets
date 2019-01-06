import PropTypes from "prop-types";
import {Component} from "react";
import withTraitify from "lib/with-traitify";

export default function componentFromAssessment(options) {
  class AssessmentComponent extends Component {
    static defaultProps = {assessment: null}
    static propTypes = {
      assessment: PropTypes.shape({assessment_type: PropTypes.string.isRequired})
    }
    constructor(props) {
      super(props);

      this.state = {component: null};
    }
    componentDidMount() {
      if(this.props.assessment) { this.pickComponent(); }
    }
    componentDidUpdate(prevProps) {
      const {assessment} = this.props;

      if(assessment && assessment !== prevProps.assessment) { this.pickComponent(); }
    }
    pickComponent() {
      this.setState({component: options[this.props.assessment.assessment_type]});
    }
    render() {
      const ChosenComponent = this.state.component;

      return ChosenComponent ? <ChosenComponent {...this.props} /> : <div />;
    }
  }

  return withTraitify(AssessmentComponent);
}
