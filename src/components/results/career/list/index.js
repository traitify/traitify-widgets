import useCareers from "lib/hooks/use-careers";
import useComponentEvents from "lib/hooks/use-component-events";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import Career from "../details";
import HighlightedCareers from "./highlighted";
import style from "./style.scss";

export default function CareerList() {
  const {fetching, getNextPage, moreRecords, records} = useCareers();
  const results = useResults();
  const translate = useTranslate();

  useComponentEvents("CareerList");

  if(!results) { return null; }

  return (
    <div className={style.container}>
      <HighlightedCareers />
      {records.map(({career, score}) => (
        <Career key={career.id} career={{score, ...career}} />
      ))}
      <div className={style.center}>
        {fetching && <span>{translate("loading")}</span>}
        {!fetching && (
          <>
            {moreRecords && (
              <button key="more" className={style.more} onClick={getNextPage} type="button">{translate("show_more")}</button>
            )}
            {records.length === 0 && <span key="none">{translate("no_careers")}</span>}
            {records.length > 0 && !moreRecords && <span key="done">{translate("no_more_careers")}</span>}
          </>
        )}
      </div>
    </div>
  );
}
