import propTypes from "prop-types";
import style from "./style.scss";

export default function Header({profile, assessment}) {
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  const surveyName = assessment ? assessment.surveyName : "";
  const completedAt = assessment ? assessment.completedAt : "";

  return (
    <div className={`${style.header}`}>
      <div className={style.profileCircle}>{initials}</div>
      <div className={style.profileDetails}>
        <div className={style.profileName}>{profile.firstName} {profile.lastName}</div>
        <div>{surveyName}</div>
        <div>Completed on: {completedAt}</div>
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
    surveyName: propTypes.string.isRequired
  }).isRequired
};
