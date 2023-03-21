import PersonalityBaseDetails from "components/personality/base/details";
import PersonalityBaseHeading from "components/personality/base/heading";
import PersonalityTypes from "components/personality/type/list";
import PersonalityTraits from "components/personality/trait/list";
import style from "./style.scss";

export default function AttractReport() {
  return (
    <section className={style.container}>
      <PersonalityBaseHeading />
      <PersonalityTypes />
      <PersonalityTraits />
      <PersonalityBaseDetails />
    </section>
  );
}
