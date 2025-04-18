// TODO: Remove overrides when API is ready
export const overrides = {
  all: "50390484-de15-4530-a82c-95933282e082",
  completed: "71df3e54-2e06-40bb-a3c5-49d39957bd39",
  draft: "5135d0e0-033e-4c96-81b1-8be2036fb62a"
};

export default function orderFromQuery(response) {
  if(response.errorMessage) { console.warn("order", response.errors); } /* eslint-disable-line no-console */

  const _order = response.data.order;
  if(!_order) { return null; }

  const order = {
    assessments: _order.assessments.map((assessment) => ({
      completed: assessment.status === "COMPLETE",
      id: assessment.id,
      loaded: false,
      surveyID: assessment.surveyId,
      surveyType: assessment.type.toLowerCase()
    })),
    completed: _order.status === "COMPLETED",
    status: {
      ALL_ASSESSMENT_AVAILABLE: "incomplete",
      COMPLETED: "completed",
      DRAFT: "loading",
      FAILED: "error"
    }[_order.status],
    surveys: _order.requirements.surveys.map(({id, type}) => ({
      id,
      type: type.toLowerCase()
    }))
  };

  if(response.errorMessage) { order.errors = [response.errorMessage]; }
  return order;
}
