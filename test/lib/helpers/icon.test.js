import {faRocket} from "@fortawesome/free-solid-svg-icons";
import Icon from "lib/helpers/icon";
import ComponentHandler from "support/component-handler";

describe("Helpers", ()=>{
  describe("Icon", ()=>{
    it("renders icon", ()=>{
      const component = new ComponentHandler(<Icon icon={faRocket} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders props", ()=>{
      const component = new ComponentHandler(<Icon icon={faRocket} class="rocket" />);

      expect(component.tree.props.class).toEqual("rocket");
    });
  });
});
