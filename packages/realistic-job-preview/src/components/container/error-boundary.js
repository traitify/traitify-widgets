import PropTypes from "prop-types";
import {useState} from "react";
import useWidgetContext from "lib/hooks/use-widget-context";
import Boundary from "traitify/components/common/error-boundary";

function ErrorBoundary({children}) {
  const {dispatch} = useWidgetContext();
  const [count, setCount] = useState(0);
  const onError = (error) => {
    console.error(error); // eslint-disable-line no-console
    dispatch({error, type: "error"});
    setCount((total) => total + 1);
  };

  if(count > 2) { return null; }

  return <Boundary onError={onError}>{children}</Boundary>;
}

ErrorBoundary.propTypes = {children: PropTypes.node.isRequired};

export default ErrorBoundary;
