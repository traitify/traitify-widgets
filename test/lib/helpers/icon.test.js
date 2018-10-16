import {faRocket} from "@fortawesome/free-solid-svg-icons";
import renderJSON from "preact-render-to-json";
import Icon from "lib/helpers/icon";
import {createElement, domHooks} from "support/dom";

describe("Helpers", ()=>{
  domHooks();

  describe("Icon", ()=>{
    it("renders icon", ()=>{
      const tree = renderJSON(<Icon icon={faRocket} />, createElement());

      expect(tree).toMatchSnapshot();
    });

    it("renders props", ()=>{
      const tree = renderJSON(<Icon icon={faRocket} class="rocket" />, createElement());

      expect(tree.props.class).toEqual("rocket");
    });
  });
});
