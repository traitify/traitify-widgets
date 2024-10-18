import PropTypes from "prop-types";
import Context from "lib/context";
import ErrorBoundary from "./error-boundary";
import Theme from "./theme";
import useReducer from "./use-reducer";

function Container({children, className = null, ...props}) {
  const state = useReducer({...props});

  return (
    <Context.Provider value={state}>
      <Theme className={className}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </Theme>
    </Context.Provider>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Container;
