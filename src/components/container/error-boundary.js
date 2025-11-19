import PropTypes from "prop-types";
import {useState} from "react";
import {useSetRecoilState} from "recoil";
import Boundary from "components/common/error-boundary";
import {appendErrorState} from "lib/recoil";

function ErrorBoundary({children}) {
  const [count, setCount] = useState(0);
  const appendError = useSetRecoilState(appendErrorState);
  const onError = (error, errorInfo) => {
    console.error(error, errorInfo); // eslint-disable-line no-console
    setCount((total) => total + 1);
    appendError(`${error}: ${errorInfo}`);
  };

  if(count > 2) { return null; }

  return <Boundary onError={onError}>{children}</Boundary>;
}

ErrorBoundary.propTypes = {children: PropTypes.node.isRequired};

export default ErrorBoundary;
