import { h, Component } from "preact";

import Dimensions from "./results/dimensions";
import SlideDeck from "./slidedeck/index";

export default class Default extends Component {
  render() {
    return (
      <div>
        <SlideDeck {...this.props} />
        <Dimensions {...this.props} />
      </div>
    )
  }
}
