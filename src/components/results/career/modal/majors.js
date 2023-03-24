import useCareer from "lib/hooks/use-career";
import style from "./style.scss";

export default function CareerModalMajors() {
  const {majors} = useCareer();

  return (
    <div className={style.list}>
      {majors.map((major) => (
        <div className={style.listItem} key={major.id}>
          <div className={style.title}>{major.title}</div>
          <div className={style.description}>{major.description}</div>
        </div>
      ))}
    </div>
  );
}
