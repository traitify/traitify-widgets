import { h, Component } from "preact";
import Dimensions from "./results/dimensions";

export default class App extends Component {
  render() {
    var language = "en"
    var translations = {
      en: {
        potential_benefits: "Potential Benefits",
        potential_pitfalls: "Potential Pitfalls",
        show_less: "Show Less",
        show_more: "Show More"
      }
    }
    var translate = (key) => translations[language][key]
    return (
      <div id="app">
        <Dimensions translate={translate} />
      </div>
    );
  }
}
