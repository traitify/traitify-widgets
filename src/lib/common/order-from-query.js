export function assessmentFromQuery(response) {
  const record = {
    completed: !!(response.completed || response.completed_at || response.completedAt),
    link: response.assessmentTakerUrl,
    loaded: true,
    loading: false,
    surveyID: response.deck_id || response.surveyId || response?.surveyKey,
    surveyName: response.surveyName || response.name
  };

  // NOTE: Prevent overriding with blanks
  ["link", "surveyID", "surveyName"].filter((key) => !record[key]).forEach((key) => {
    delete record[key];
  });

  return record;
}

// NOTE: Order Service uses COMPLETED, Recommendation/Xavier uses COMPLETE
export default function orderFromQuery(response) {
  if(response.errorMessage) { console.warn("order", response.errors); } /* eslint-disable-line no-console */

  const {order} = response.data;
  if(!order) { return null; }

  const record = {
    assessments: order.assessments.map((assessment) => ({
      completed: assessment.status === "COMPLETED",
      id: assessment.id,
      loaded: false,
      surveyID: assessment.surveyId,
      surveyType: assessment.type.toLowerCase()
    })),
    completed: order.status === "COMPLETED",
    status: {
      ALL_ASSESSMENT_AVAILABLE: "incomplete",
      COMPLETED: "completed",
      DRAFT: "loading",
      FAILED: "error"
    }[order.status],
    surveys: order.requirements.surveys.map(({id, type}) => ({
      id,
      type: type.toLowerCase()
    }))
  };

  if(response.errorMessage) { record.errors = [response.errorMessage]; }
  return record;
}
