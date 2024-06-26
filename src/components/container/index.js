import PropTypes from "prop-types";
import {RecoilRoot} from "recoil";
import ErrorBoundary from "./error-boundary";
import State from "./state";
import Theme from "./theme";

function Container({className = null, ...props}) {
  return (
    <RecoilRoot>
      <Theme className={className}>
        <ErrorBoundary>
          <State {...props} />
        </ErrorBoundary>
      </Theme>
    </RecoilRoot>
  );
}

Container.propTypes = {className: PropTypes.string};

export default Container;
