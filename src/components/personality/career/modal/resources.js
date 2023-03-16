import useCareer from "lib/hooks/use-career";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function CareerModalResources() {
  const {resources} = useCareer();
  const translate = useTranslate();

  return (
    <div className={style.list}>
      {resources.map((resource) => (
        <div className={style.listItem} key={resource.url}>
          <div className={style.job}>
            <div className={style.jobDetails}>
              <div>
                <div className={style.title}>
                  {resource.name}
                </div>
                <div className={style.description}>
                  {resource.description}
                </div>
              </div>
            </div>
            <div>
              <a className={style.applyNowButton} href={resource.url}>
                {translate("learn_more")}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
