import orderFromQuery from "lib/common/order-from-query";
import incomplete from "support/data/order/incomplete";

describe("orderFromQuery", () => {
  it("maps types from order", () => {
    const order = orderFromQuery({data: {order: incomplete}});

    expect(order.assessments.map(({surveyType}) => surveyType))
      .toEqual(["cognitive", "external", "personality"]);
    expect(order.surveys.map(({type}) => type))
      .toEqual(["cognitive", "external", "personality"]);
  });

  it("maps realistic type to rjp", () => {
    const response = {
      data: {
        order: {
          assessments: [
            {
              id: "rjp-xyz",
              status: "CREATED",
              surveyId: "rjp-survey-xyz",
              type: "REALISTIC"
            }
          ],
          requirements: {
            surveys: [{id: "rjp-survey-xyz", type: "REALISTIC"}]
          },
          status: "ALL_ASSESSMENT_AVAILABLE"
        }
      }
    };

    const order = orderFromQuery(response);

    expect(order.assessments[0].surveyType).toBe("rjp");
    expect(order.surveys[0].type).toBe("rjp");
    expect(order.status).toBe("incomplete");
  });
});
