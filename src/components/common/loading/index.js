import style from "./style.scss";

export default function Loading() {
  return (
    <div className={style.container}>
      <div className={style.loading}>
        <div />
        <div />
      </div>
    </div>
  );
}
