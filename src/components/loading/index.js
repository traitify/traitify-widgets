import style from "./style.scss";

export default function Loading() {
  return (
    <div className={style.loadingContainer}>
      <div className={style.loading}>
        <i />
        <i />
      </div>
    </div>
  );
}
