import propTypes from "prop-types";
import {useState} from "react";
import SimpleDropdown from "components/common/dropdown/simple";
import useTranslate from "lib/hooks/use-translate";
import i18nData from "lib/i18n-data";
import style from "./style.scss";

export default function Header({profile, assessment}) {
  const translate = useTranslate();
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  const surveyName = assessment ? assessment.surveyName : "";
  const assessmentLocale = assessment ? assessment.localeKey : "en-US";

  const [locale, setLocale] = useState(assessmentLocale);
  const completedAt = assessment ? new Date(Number(assessment.completedAt)) : "";
  const formattedCompletedAt = assessment
    ? completedAt.toLocaleString(locale, {year: "numeric", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit"})
    : "";
  const localeOptions = Object.keys(i18nData).map((key) => ({
    value: key,
    name: i18nData[key].name
  }));

  return (
    <div className={`${style.header}`}>
      <div className={style.profileDetails}>
        <div className={style.profileCircle}>{initials}</div>
        <div>
          <div className={style.profileName}>{profile.firstName} {profile.lastName}</div>
          <div>{surveyName}</div>
          <div>{translate("results.generic.completed_on")} {formattedCompletedAt}</div>
        </div>
      </div>
      <div>
        <SimpleDropdown
          id="localeSelector"
          options={localeOptions}
          defaultValue={assessmentLocale}
          className={style.localeDropdown}
          onChange={({target: {value}}) => setLocale(value)}
        />
      </div>
    </div>
  );
}

Header.propTypes = {
  profile: propTypes.shape({
    firstName: propTypes.string.isRequired,
    lastName: propTypes.string.isRequired
  }).isRequired,
  assessment: propTypes.shape({
    completedAt: propTypes.string.isRequired,
    surveyName: propTypes.string.isRequired,
    localeKey: propTypes.string.isRequired
  }).isRequired
};
