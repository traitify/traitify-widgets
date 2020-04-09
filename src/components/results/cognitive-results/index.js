import style from "./style.scss";

export default function CognitiveResults() {
  return (
    <section className={style.results}>
      <img alt="Brain" src="https://cdn.traitify.com/images/cognitive/brain.png" />
      <h1>Thank you for taking the assessment.</h1>
      <p className={style.learn}>To learn more about the assessment you just took, please visit <a href="https://www.traitify.com">Traitify.com</a>.</p>
    </section>
  );
}
