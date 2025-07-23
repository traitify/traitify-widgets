import propTypes from "prop-types";
import style from "./style.scss";

export default function Header({profile, assessment}) {
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  return (
    <div className={`${style.header}`}>
      <div className={style.profileCircle}>{initials}</div>
      <div className={style.profileDetails}>
        <div className={style.profileName}>{profile.firstName} {profile.lastName}</div>
        <div>Generic Assessment</div>
        <div>Completed on: {assessment ? assessment.completedAt : ""}</div>
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
    completedAt: propTypes.string
  }).isRequired
};
