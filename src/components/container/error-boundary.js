import PropTypes from "prop-types";
import {useSetRecoilState} from "recoil";
import Boundary from "components/common/error-boundary";
import {errorState} from "lib/recoil";

// TODO: After x errors, render error page to prevent infinite loop
function ErrorBoundary({children}) {
  const setError = useSetRecoilState(errorState);
  const onError = (error) => {
    console.error(error); // eslint-disable-line no-console
    setError(error);
  };

  return <Boundary onError={onError}>{children}</Boundary>;
}

ErrorBoundary.propTypes = {children: PropTypes.node.isRequired};

export default ErrorBoundary;
