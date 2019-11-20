import DangerousHTML from "lib/helpers/dangerous-html";
import ComponentHandler from "support/component-handler";

describe("Helpers", () => {
  describe("DangerousHTML", () => {
    let props;

    beforeEach(() => {
      props = {html: "Something <em>Dangerous</em>"};
    });

    it("passes props", () => {
      props.className = "danger";
      const component = new ComponentHandler(<DangerousHTML {...props} />);

      expect(component.props.className).toEqual("danger");
    });

    it("renders component", () => {
      const component = new ComponentHandler(<DangerousHTML {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders tag", () => {
      props.tag = "h1";
      const component = new ComponentHandler(<DangerousHTML {...props} />);

      expect(component.tree).toMatchSnapshot();
    });
  });
});
