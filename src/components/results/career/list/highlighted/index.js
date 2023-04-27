import useHighlightedCareers from "lib/hooks/use-highlighted-careers";
import Career from "components/results/career/details";
import style from "./style.scss";

export default function CareerListHighlighted() {
  const {records} = useHighlightedCareers();
  if(records.length === 0) { return null; }

  return (
    <div className={style.container}>
      <div className={style.header}>Highlighted Careers</div>
      <div className={style.content}>
        {records.map(({career, score}) => (
          <Career key={career.id} career={{score, ...career}} />
        ))}
      </div>
    </div>
  );
}
