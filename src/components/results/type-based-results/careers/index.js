import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import CareerFilter from "../career-filter";
import CareerModal from "../career-modal";
import CareerResults from "../career-results";
import style from "./style.scss";

class Careers extends Component {
  static propTypes = {
    isReady: PropTypes.func.isRequired,
    ui: TraitifyPropTypes.ui.isRequired
  };
  componentDidMount() {
    this.props.ui.trigger("Careers.initialized", this);
  }
  componentDidUpdate() {
    this.props.ui.trigger("Careers.updated", this);
  }
  render() {
    if(!this.props.isReady("results")) { return null; }

    return (
      <div className={style.container}>
        <CareerFilter {...this.props} />
        <CareerResults {...this.props} />
        <CareerModal {...this.props} />
      </div>
    );
  }
}

export {Careers as Component};
export default withTraitify(Careers);
