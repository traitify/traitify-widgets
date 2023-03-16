import useCareer from "lib/hooks/use-career";
import style from "./style.scss";

export default function CareerModalClubs() {
  const {clubs} = useCareer();

  return (
    <div className={style.list}>
      {clubs.map((club) => (
        <div className={style.listItem} key={club.id}>
          <div className={style.title}>{club.name}</div>
          <div className={style.description}>{club.description}</div>
        </div>
      ))}
    </div>
  );
}
