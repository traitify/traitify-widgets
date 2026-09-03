/** @jest-environment jsdom */
import Component from "components/results/external/crosschq";
import ComponentHandler from "support/component-handler";
import {mockExternalAssessment, mockOrder} from "support/container/http";
import {mockOption} from "support/container/options";
import externalCompleted from "support/data/assessment/external/completed";
import externalCrosschq from "support/data/assessment/external/crosschq";
import order from "support/data/order/external";
import useContainer from "support/hooks/use-container";

describe("Results.External.Crosschq", () => {
  let component;
  let target;

  useContainer();

  beforeEach(() => {
    target = document.createElement("div");
    container.orderID = order.id;
    mockOrder(order);
    mockExternalAssessment(externalCrosschq, {mockRecommendation: false});
  });

  afterEach(() => {
    delete container.orderID;
  });

  const setup = () => ComponentHandler.setup(Component, {
    createNodeMock: () => target,
    props: {id: externalCrosschq.id}
  });

  it("mounts the crosschq widget into the target", async() => {
    component = await setup();

    expect(target.childNodes.length).toBeGreaterThan(0);
  });

  it("destroys the widget on unmount", async() => {
    component = await setup();
    component.unmount();

    expect(target.childNodes.length).toBe(0);
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["CrosschqResults"]);
    component = await setup();

    expect(component.tree.children).toBeNull();
    expect(target.childNodes.length).toBe(0);
  });

  it("renders nothing without results", async() => {
    mockExternalAssessment(externalCompleted, {mockRecommendation: false});
    component = await setup();

    expect(component.tree.children).toBeNull();
    expect(target.childNodes.length).toBe(0);
  });
});
