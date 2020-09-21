import PropTypes from "prop-types";
import DangerousHTML from "lib/helpers/dangerous-html";
import withTraitify from "lib/with-traitify";
import style from "./style.scss";

function CognitiveResults({translate}) {
  return (
    <section className={style.results}>
      <img alt="Brain" src="https://cdn.traitify.com/images/cognitive/brain.png" />
      <h1>{translate("cognitive_results_heading")}</h1>
      <DangerousHTML html={translate("cognitive_results_html")} />
    </section>
  );
}

CognitiveResults.propTypes = {
  translate: PropTypes.func.isRequired
};

export {CognitiveResults as Component};
export default withTraitify(CognitiveResults);
