import { h, Component } from "preact";
import Dimensions from "./dimensions";

export default class Results extends Component {
  render() {
    return <Dimensions {...this.props} />
  }
}
