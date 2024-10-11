/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import Component from "components/common/dropdown";
import ComponentHandler from "support/component-handler";
import useGlobalMock from "support/hooks/use-global-mock";

describe("Dropdown", () => {
  let component;
  let options;
  let props;
  let queryElement;

  useGlobalMock(document, "querySelector");

  beforeEach(() => {
    options = [
      {name: "First", value: "one"},
      {name: "Second", value: "two"},
      {name: "Third", value: "three"}
    ];
    props = {
      id: "record-name",
      name: "name",
      onChange: jest.fn().mockName("onChange"),
      options
    };
    queryElement = {
      firstChild: {focus: jest.fn().mockName("focus")},
      focus: jest.fn().mockName("focus"),
      lastChild: {focus: jest.fn().mockName("focus")}
    };

    document.querySelector.mockReturnValue(queryElement);
  });

  describe("fancy", () => {
    beforeEach(() => {
      props = {...props, currentText: "Current", searchText: "Search"};
    });

    describe("keys", () => {
      let firstOption;
      let lastOption;
      let middleOption;

      beforeEach(() => {
        firstOption = props.options[0];
        lastOption = props.options[props.options.length - 1];
        middleOption = props.options[1];

        component = ComponentHandler.render(Component, {props});
        act(() => { component.findByText(props.searchText).props.onClick(); });
      });

      it("arrows up from first result", () => {
        const currentTarget = {nextSibling: {focus: jest.fn().mockName("focus")}};

        act(() => {
          component.findByText(firstOption.name)
            .props.onKeyDown({currentTarget, key: "ArrowUp", preventDefault: () => {}});
        });

        expect(currentTarget.nextSibling.focus).not.toHaveBeenCalled();
        expect(queryElement.firstChild.focus).not.toHaveBeenCalled();
        expect(queryElement.lastChild.focus).toHaveBeenCalled();
      });

      it("arrows up from last result", () => {
        const currentTarget = {previousSibling: {focus: jest.fn().mockName("focus")}};

        act(() => {
          component.findByText(lastOption.name)
            .props.onKeyDown({currentTarget, key: "ArrowUp", preventDefault: () => {}});
        });

        expect(currentTarget.previousSibling.focus).toHaveBeenCalled();
        expect(queryElement.firstChild.focus).not.toHaveBeenCalled();
        expect(queryElement.lastChild.focus).not.toHaveBeenCalled();
      });

      it("arrows up from search", () => {
        act(() => {
          component.instance.findByProps({placeholder: props.searchText})
            .props.onKeyDown({key: "ArrowUp", preventDefault: () => {}});
        });

        expect(queryElement.firstChild.focus).not.toHaveBeenCalled();
        expect(queryElement.lastChild.focus).toHaveBeenCalled();
      });

      it("arrows down from first result", () => {
        const currentTarget = {nextSibling: {focus: jest.fn().mockName("focus")}};

        act(() => {
          component.findByText(firstOption.name)
            .props.onKeyDown({currentTarget, key: "ArrowDown", preventDefault: () => {}});
        });

        expect(currentTarget.nextSibling.focus).toHaveBeenCalled();
        expect(queryElement.firstChild.focus).not.toHaveBeenCalled();
        expect(queryElement.lastChild.focus).not.toHaveBeenCalled();
      });

      it("arrows down from last result", () => {
        const currentTarget = {previousSibling: {focus: jest.fn().mockName("focus")}};

        act(() => {
          component.findByText(lastOption.name)
            .props.onKeyDown({currentTarget, key: "ArrowDown", preventDefault: () => {}});
        });

        expect(currentTarget.previousSibling.focus).not.toHaveBeenCalled();
        expect(queryElement.firstChild.focus).toHaveBeenCalled();
        expect(queryElement.lastChild.focus).not.toHaveBeenCalled();
      });

      it("arrows down from search", () => {
        act(() => {
          component.instance.findByProps({placeholder: props.searchText})
            .props.onKeyDown({key: "ArrowDown", preventDefault: () => {}});
        });

        expect(queryElement.firstChild.focus).toHaveBeenCalled();
        expect(queryElement.lastChild.focus).not.toHaveBeenCalled();
      });

      it("selects with enter", () => {
        const currentTarget = {
          click: jest.fn().mockName("click"),
          nextSibling: {focus: jest.fn().mockName("focus")},
          previousSibling: {focus: jest.fn().mockName("focus")}
        };

        act(() => {
          component.findByText(middleOption.name)
            .props.onKeyDown({currentTarget, key: "Enter", preventDefault: () => {}});
        });

        expect(currentTarget.click).toHaveBeenCalled();
        expect(currentTarget.nextSibling.focus).not.toHaveBeenCalled();
        expect(currentTarget.previousSibling.focus).not.toHaveBeenCalled();
        expect(queryElement.firstChild.focus).not.toHaveBeenCalled();
        expect(queryElement.lastChild.focus).not.toHaveBeenCalled();
      });

      it("selects with space", () => {
        const currentTarget = {
          click: jest.fn().mockName("click"),
          nextSibling: {focus: jest.fn().mockName("focus")},
          previousSibling: {focus: jest.fn().mockName("focus")}
        };

        act(() => {
          component.findByText(middleOption.name)
            .props.onKeyDown({currentTarget, code: "Space", preventDefault: () => {}});
        });

        expect(currentTarget.click).toHaveBeenCalled();
        expect(currentTarget.nextSibling.focus).not.toHaveBeenCalled();
        expect(currentTarget.previousSibling.focus).not.toHaveBeenCalled();
        expect(queryElement.firstChild.focus).not.toHaveBeenCalled();
        expect(queryElement.lastChild.focus).not.toHaveBeenCalled();
      });
    });

    describe("search", () => {
      beforeEach(() => {
        const currentOption = props.options[2];
        props.value = currentOption.value;
        component = ComponentHandler.render(Component, {props});
        act(() => { component.findByText(currentOption.name).parent.parent.props.onClick(); });
      });

      it("searches by name", () => {
        act(() => {
          component.instance.findByProps({placeholder: props.searchText})
            .props.onChange({target: {value: "Sec"}});
        });

        expect(component.tree).toMatchSnapshot();
      });

      it("searches by value", () => {
        act(() => {
          component.instance.findByProps({placeholder: props.searchText})
            .props.onChange({target: {value: "Tw"}});
        });

        expect(component.tree).toMatchSnapshot();
      });

      it("searches without results", () => {
        act(() => {
          component.instance.findByProps({placeholder: props.searchText})
            .props.onChange({target: {value: "Twenty"}});
        });

        expect(component.tree).toMatchSnapshot();

        act(() => { component.findByText(props.searchText).props.onClick(); });

        expect(component.tree).toMatchSnapshot();
      });
    });

    it("renders component", () => {
      component = ComponentHandler.render(Component, {props});

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component with options", () => {
      component = ComponentHandler.render(Component, {props});
      act(() => { component.findByText(props.searchText).props.onClick(); });

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component with value", () => {
      props.value = props.options[2].value;
      component = ComponentHandler.render(Component, {props});

      expect(component.tree).toMatchSnapshot();
    });

    describe("select", () => {
      it("selects current option", () => {
        const option = props.options[2];
        props.value = option.value;
        component = ComponentHandler.render(Component, {props});
        act(() => { component.findByText(option.name).parent.parent.props.onClick(); });
        act(() => {
          component.instance.find((element) => (
            element.type === "button"
            && element.children.includes(option.name)
            && element.children.includes(props.currentText)
          )).props.onClick();
        });

        expect(component.tree).toMatchSnapshot();
      });

      it("selects option", () => {
        const currentOption = props.options[2];
        const option = props.options[1];
        props.value = currentOption.value;
        component = ComponentHandler.render(Component, {props});
        act(() => { component.findByText(currentOption.name).parent.parent.props.onClick(); });
        act(() => {
          component.instance.find((element) => (
            element.type === "button"
            && element.children.includes(option.name)
          )).props.onClick();
        });

        expect(component.tree).toMatchSnapshot();
      });
    });
  });

  describe("options", () => {
    it("renders with objects", () => {
      component = ComponentHandler.render(Component, {props});

      expect(component.tree).toMatchSnapshot();
    });

    it("renders with strings", () => {
      props.options = ["one", "two", "three"];
      component = ComponentHandler.render(Component, {props});

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("simple", () => {
    it("renders component", () => {
      component = ComponentHandler.render(Component, {props});

      expect(component.tree).toMatchSnapshot();
    });
  });
});
