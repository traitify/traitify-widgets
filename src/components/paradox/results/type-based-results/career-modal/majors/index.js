import style from "./style.scss";

function Majors({majors}) {

  console.log(majors);
  return (
    <div className={style.container}>
      {majors.map((major) => <div>{major.title}</div>)}
    </div>
  )
}
export default Majors;
