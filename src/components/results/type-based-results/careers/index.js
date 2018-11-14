import PropTypes from "prop-types";
import {Component} from "react";
import TraitifyPropType from "lib/helpers/prop-type";
import withTraitify from "lib/with-traitify";
import CareerFilter from "../career-filter";
import CareerModal from "../career-modal";
import CareerResults from "../career-results";
import style from "./style";

class Careers extends Component {
  static propTypes = {
    isReady: PropTypes.func.isRequired,
    traitify: TraitifyPropType.isRequired
  }
  componentDidMount() {
    this.props.traitify.ui.trigger("Careers.initialized", this);
  }
  componentDidUpdate() {
    this.props.traitify.ui.trigger("Careers.updated", this);
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
