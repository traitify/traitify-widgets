import PropTypes from "prop-types";
import {useMemo} from "react";
import Carousel from "./carousel";
import Fallback from "./fallback";
import Job from "./job";

function Jobs({jobs, jobSource}) {
  const FallbackComponent = useMemo(() => <Fallback jobSource={jobSource} />, [jobSource]);

  return (
    <Carousel
      Component={Job}
      FallbackComponent={FallbackComponent}
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
  ).isRequired,
  jobSource: PropTypes.string.isRequired
};

export default Jobs;
