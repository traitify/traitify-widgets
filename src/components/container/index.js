import {RecoilRoot} from "recoil";
import ErrorBoundary from "./error-boundary";
import State from "./state";

export default function Container(props) {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <State {...props} />
      </ErrorBoundary>
    </RecoilRoot>
  );
}
