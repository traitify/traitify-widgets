import { h, Component } from "preact";
import style from "./style";

export default class PersonalityBlend extends Component {
  render() {
    return (
      <div class={style.blend}>
        <div class={style.blendImage} style="border: 3px solid #a75bd8; background-color: rgba(167, 91, 216, 0.085);">
          <img src="//placehold.it/300x300" />
        </div>
        <div class={style.blendImage} style="border: 3px solid #17AEE7; background-color: rgba(23, 174, 231, 0.085);">
          <img src="//placehold.it/300x300" />
        </div>

        <h3 class={style.blendName}>Visionary/Analyzer</h3>
        <p class={style.blendDescription}>Consectetur sunt vero consequuntur ut at? Sapiente laborum sequi culpa iste aliquid. Fugit dicta cumque ad pariatur sunt aperiam Enim esse iure illum perspiciatis et officiis Assumenda odit veritatis modi. Consectetur sunt vero consequuntur ut at? Sapiente laborum sequi culpa iste aliquid. Fugit dicta cumque ad pariatur sunt aperiam Enim esse iure illum perspiciatis et officiis Assumenda odit veritatis modi.</p>
      </div>
    );
  }
}
