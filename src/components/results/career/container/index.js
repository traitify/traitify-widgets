import useComponentEvents from "lib/hooks/use-component-events";
import useResults from "lib/hooks/use-results";
import style from "./style.scss";
import CareerFilter from "../filter";
import CareerList from "../list";
import CareerModal from "../modal";

export default function CareerContainer() {
  const results = useResults({surveyType: "personality"});

  useComponentEvents("Careers");

  if(!results) { return null; }

  return (
    <div className={style.container}>
      <CareerFilter />
      <CareerList />
      <CareerModal />
    </div>
  );
}
