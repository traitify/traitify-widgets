import PropTypes from "prop-types";
import {RecoilRoot} from "recoil";
import ErrorBoundary from "./error-boundary";
import State from "./state";
import Theme from "./theme";

function Container(props) {
  return (
    <RecoilRoot>
      <Theme className={props.className}>
        <ErrorBoundary>
          <State {...props} />
        </ErrorBoundary>
      </Theme>
    </RecoilRoot>
  );
}

Container.defaultProps = {className: null};
Container.propTypes = {className: PropTypes.string};

export default Container;
