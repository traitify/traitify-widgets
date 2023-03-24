import useCareer from "lib/hooks/use-career";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function CareerModalEmployers() {
  const {employers} = useCareer();
  const translate = useTranslate();

  return (
    <div className={style.list}>
      {employers.map((employer) => (
        <div className={style.listItem} key={employer.url}>
          <div className={style.job}>
            <div className={style.jobDetails}>
              <div>
                <div className={style.title}>
                  {employer.name}
                </div>
                <div className={style.description}>
                  {employer.description}
                </div>
              </div>
            </div>
            <div>
              <a className={style.applyNowButton} href={employer.url}>
                {translate("learn_more")}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
