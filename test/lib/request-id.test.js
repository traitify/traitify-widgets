const {chainRequestID, generateWidgetID} = jest.requireActual("lib/request-id");

describe("request-id", () => {
  describe("generateWidgetID", () => {
    it("prefixes the id with widget-", () => {
      expect(generateWidgetID()).toMatch(/^widget-/);
    });

    it("generates a unique id each call", () => {
      expect(generateWidgetID()).not.toBe(generateWidgetID());
    });
  });

  describe("chainRequestID", () => {
    it("appends a 6-char hex code to the widget id", () => {
      expect(chainRequestID("widget-abc")).toMatch(/^widget-abc\.[0-9a-f]{6}$/);
    });

    it("generates a unique code each call", () => {
      expect(chainRequestID("widget-abc")).not.toBe(chainRequestID("widget-abc"));
    });
  });
});
