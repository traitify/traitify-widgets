import BaseDetails from "components/results/personality/base/details";
import BaseHeading from "components/results/personality/base/heading";
import Types from "components/results/personality/type/list";
import Traits from "components/results/personality/trait/list";
import style from "./style.scss";

export default function AttractReport() {
  return (
    <section className={style.container}>
      <BaseHeading />
      <Types />
      <Traits />
      <BaseDetails />
    </section>
  );
}
