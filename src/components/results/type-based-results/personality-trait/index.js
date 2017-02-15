import { h, Component } from "preact";
import style from "./style";

export default class PersonalityTrait extends Component {
  render() {
    return (
      <div class={style.trait} style="background: #fff3ed;">
        <div class={style.traitBar} style="width: 98%; background: #f66c0f;"></div>
        <div class={style.traitContent}>
          <div class={style.traitScore}>98%</div>
          <img src='//placehold.it/100x100' alt='Type Name icon' class={style.traitIcon} />
          <h3 class={style.traitName}>Trait Name
          <span class={style.traitDescription}>feeling compelled, by a strong impulse, to act or behave in a certain way, which is usually repetitive</span>
          </h3>
        </div>
      </div>
    );
  }
}
