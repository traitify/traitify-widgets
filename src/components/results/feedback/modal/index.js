import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {feedbackModalShowState} from "lib/recoil";
import {useRecoilState} from "recoil";
import useTranslate from "lib/hooks/use-translate";
import Icon from "components/common/icon";
import style from "./style.scss";

export default function FeedbackModal() {
  const [show, setShow] = useRecoilState(feedbackModalShowState);
  const translate = useTranslate(); // TODO i18n

  if(!show) {
    return null;
  }

  const onCancel = () => {
    setShow(false);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const response = new Map(new FormData(event.target).entries());
    console.log("response :>> ", response);
    // TODO send to server
  };

  const questionEntries = [
    {
      id: "overall-experience-assessment",
      q: "What was your overall experience of taking the assessment?",
      opts: ["Positive", "Negative", "Not sure/No opinion"]
    },
    {
      id: "overall-opinion-images",
      q: "What was your overall opinion of the images in the assessment?",
      opts: ["I liked them", "I didn’t like them", "Not sure/No opinion"]
    },
    {
      id: "assessment-effect-interest",
      q: "Did taking this assessment affect your interest in working for this company?",
      opts: [
        "Increased my interest",
        "Decreased my interest",
        "Had no effect",
        "N/A. I did not take this as part of a hiring process"
      ]
    }
  ];

  return (
    <div className={`${style.modal} ${style.container}`}>
      <section className={style.modalContainer}>
        <div className={style.modalContent}>

          <form onSubmit={onSubmit} id="form">

            <div className={style.header}>
              <div>Share Your Perspective</div>
              <div>
                <Icon
                  aria-label={translate("close")}
                  className={style.close}
                  icon={faTimes}
                  onClick={() => setShow(false)}
                  tabIndex="-1"
                />
              </div>
            </div>

            <hr className={style.grayDivider} />

            <div className={style.content}>
              <span>We&apos;d like to learn about your experience</span>

              {questionEntries.map((entry) => (
                <div key={entry.id}>
                  <label htmlFor={entry.id} className={style.question}>{entry.q}</label>
                  <select form="form" className={style.dropdown} id={entry.id} name={entry.id} defaultValue="">
                    <option value="" disabled={true} hidden={true}>Select</option>
                    {entry.opts.map((answer) => (
                      <option key={answer} value={answer}>{answer}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <hr className={style.grayDivider} />

            <div className={style.footer}>

              <button className={style.cancelBtn} onClick={onCancel} type="button">
                Cancel
              </button>
              <button type="submit" className={style.submitBtn}>Submit</button>
            </div>

          </form>

        </div>
      </section>
    </div>
  );
}
