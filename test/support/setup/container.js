jest.mock("lib/common/load-font");
jest.mock("lib/request-id", () => ({
  chainRequestID: (widgetID) => `${widgetID}.aaaaaa`,
  generateWidgetID: () => "widget-test"
}));

afterEach(() => { jest.clearAllTimers(); });
