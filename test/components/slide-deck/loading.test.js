import Component from "components/slide-deck/loading";
import ComponentHandler from "support/component-handler";

describe("Loading", () => {
  let props;

  beforeEach(() => {
    props = {
      imageLoading: true,
      retry: jest.fn().mockName("retry"),
      translate: jest.fn().mockName("translate").mockImplementation((value) => value)
    };
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders retry button if not loading", () => {
    props.imageLoading = false;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
