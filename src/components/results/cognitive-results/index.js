import style from "./style.scss";

export default function CognitiveResults() {
  return (
    <section className={style.completion}>
      <img src="https://cdn.traitify.com/images/cognitive.png" alt="Brain" />
      <h1>Thank you for taking the assessment.</h1>
      <p>Your results have been successfully sent to your organization&apos;s administrators.</p>
      <p className={style.learn}>To learn more about the assessment you just took, please visit <a href="https://www.traitify.com">Traitify.com</a>.</p>
    </section>
  );
}
