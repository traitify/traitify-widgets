import {createRef} from "react";
import useI18n from "lib/hooks/use-i18n";
import ComponentHandler from "support/component-handler";
import {mockTranslations} from "support/container/http";
import useContainer from "support/hooks/use-container";

describe("useI18n", () => {
  let value;

  function Component() {
    const i18n = useI18n();
    value.current = i18n;

    return null;
  }

  useContainer();

  beforeEach(() => {
    value = createRef(null);
  });

  it("translates", async() => {
    await ComponentHandler.setup(Component);

    expect(value.current.translate("en-us", "tip_type_for_tools")).toEqual("Tools To Use");
    expect(value.current.translate("en-us", "results.reports.candidate")).toEqual("Candidate Report");
    expect(value.current.translate("en-us", "results.reports.manager")).toEqual("Hiring Manager Report");
  });

  it("translates with remote translations", async() => {
    mockTranslations({
      "en-us": {
        results: {
          reports: {
            candidate: "Candidate",
            employee: "Unemployed Report"
          }
        },
        tip_type_for_tools: "Tools for Tots"
      }
    });
    await ComponentHandler.setup(Component);

    expect(value.current.translate("en-us", "tip_type_for_tools")).toEqual("Tools for Tots");
    expect(value.current.translate("en-us", "results.reports.manager")).toEqual("Hiring Manager Report");
  });
});
