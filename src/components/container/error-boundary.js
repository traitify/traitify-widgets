import PropTypes from "prop-types";
import {useState} from "react";
import {useSetRecoilState} from "recoil";
import Boundary from "components/common/error-boundary";
import {errorState} from "lib/recoil";

function ErrorBoundary({children}) {
  const [count, setCount] = useState(0);
  const setError = useSetRecoilState(errorState);
  const onError = (error) => {
    console.error(error); // eslint-disable-line no-console
    setCount((total) => total + 1);
    setError(error);
  };

  if(count > 2) { return null; }

  return <Boundary onError={onError}>{children}</Boundary>;
}

ErrorBoundary.propTypes = {children: PropTypes.node.isRequired};

export default ErrorBoundary;
