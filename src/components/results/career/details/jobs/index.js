import PropTypes from "prop-types";
import {useRecoilValue} from "recoil";
import {inlineJobsState} from "lib/recoil";
import Carousel from "./carousel";
import Fallback from "./fallback";
import Job from "./job";

function Jobs({career}) {
  const {hide, records} = useRecoilValue(inlineJobsState(career.id));
  if(hide) { return null; }

  return (
    <Carousel
      Component={Job}
      FallbackComponent={Fallback}
      records={records}
    />
  );
}

Jobs.propTypes = {
  career: PropTypes.shape({id: PropTypes.string.isRequired}).isRequired
};

export default Jobs;
