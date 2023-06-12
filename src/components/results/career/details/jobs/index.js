import PropTypes from "prop-types";
import Carousel from "./carousel";
import Fallback from "./fallback";
import Job from "./job";

function Jobs({jobs}) {
  return (
    <Carousel
      Component={Job}
      FallbackComponent={Fallback}
      records={jobs}
    />
  );
}

Jobs.propTypes = {
  jobs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      company: PropTypes.string,
      location: PropTypes.string,
      url: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Jobs;
