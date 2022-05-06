import PropTypes from "prop-types";
import style from "./style.scss";

function Jobs({jobs}) {
  return (
    <div className={style.container}>
      {jobs.map((job) => (
        <div className={style.job} key={job.id}>
          <div className={style.title}>{job.title}</div>
          <div className={style.description}>{job.description}</div>
        </div>
      ))}
    </div>
  );
}
Jobs.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired
};
export default Jobs;
