import { h, Component } from "preact";

export default class slideDeck extends Component {
  render() {
    return (
      <div class="slide" style={{backgroundImage: `url(${this.props.slide.image_desktop_retina})`}}>
        <div>
          {this.props.slide.caption}
        </div>
      </div>
    )
  }
}
