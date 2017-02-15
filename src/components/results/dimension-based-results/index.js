import { h, Component } from "preact";
import Dimension from "./dimension";
import Radar from "./radar";

export default class DimensionBasedResults extends Component {
  render() {
    return (
      <section>
        <Radar {...this.props} />
        <Dimensions {...this.props} />
      </section>
    );
  }
}
