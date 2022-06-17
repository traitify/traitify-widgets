import PropTypes from "prop-types";
import TraitifyPropTypes from "lib/helpers/prop-types";
import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import withTraitify from "lib/with-traitify";
import CareerFilter from "../filter";
import CareerList from "../list";
import CareerModal from "../modal";
import style from "./style.scss";

function CareerContainer(props) {
  const {ui, isReady, setElement} = props;
  const state = {};

  useDidMount(() => { ui.trigger("Careers.initialized", {props, state}); });
  useDidUpdate(() => { ui.trigger("Careers.updated", {props, state}); });

  return (
    isReady("results") && (
      <div className={style.container} ref={setElement}>
        <CareerFilter {...props} />
        <CareerList {...props} />
        <CareerModal {...props} />
      </div>
    )
  );
}
CareerContainer.propTypes = {
  isReady: PropTypes.func.isRequired,
  ui: TraitifyPropTypes.ui.isRequired,
  setElement: PropTypes.func.isRequired
};

export {CareerContainer as Component};
export default withTraitify(CareerContainer);
