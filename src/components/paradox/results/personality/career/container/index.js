import PropTypes from "prop-types";
import {useEffect} from "react";
import TraitifyPropTypes from "lib/helpers/prop-types";
import withTraitify from "lib/with-traitify";
import CareerFilter from "../filter";
import CareerModal from "../modal";
import CareerResults from "../list";
import style from "./style.scss";

function Careers(props) {
  const {ui, isReady} = props;

  useEffect(() => {
    ui.trigger("Careers.initialized", {props});
  }, []);
  useEffect(() => {
    ui.trigger("Careers.updated", {props});
  });

  return (
    isReady("results") && (
      <div className={style.container}>
        <CareerFilter {...props} />
        <CareerResults {...props} />
        <CareerModal {...props} />
      </div>
    )
  );
}
Careers.propTypes = {
  isReady: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired
};
export {Careers as Component};
export default withTraitify(Careers);
