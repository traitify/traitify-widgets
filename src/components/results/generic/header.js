import propTypes from "prop-types";
import SimpleDropdown from "components/common/dropdown/simple";
import i18nData from "lib/i18n-data";
import style from "./style.scss";

export default function Header({profile, assessment}) {
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  const surveyName = assessment ? assessment.surveyName : "";
  const completedAt = assessment ? assessment.completedAt : "";
  const assessmentLocale = assessment ? assessment.localeKey : "en-US";
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
          <div>Completed on: {completedAt}</div>
        </div>
      </div>
      <div>
        <SimpleDropdown
          id="localeSelector"
          options={localeOptions}
          defaultValue={assessmentLocale}
          className={style.localeDropdown}
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
    completedAt: propTypes.string,
    surveyName: propTypes.string.isRequired,
    localeKey: propTypes.string.isRequired
  }).isRequired
};
