import dig from "lib/common/object/dig";

// NOTE: Fields with underscores are from personality API (plus skipped field)
export function assessmentFromQuery(response) {
  const record = {
    completed: !!(response.completed || response.completed_at || response.completedAt),
    link: response.signInUrl || response.assessmentTakerUrl,
    loaded: true,
    loading: false,
    profileID: response.profile_id || response.profileId || dig(response, "profile_ids", 0),
    skipped: response.isSkipped || response.skipped || false,
    surveyID: response.deck_id || response.surveyId || response.surveyKey,
    surveyName: response.surveyName || response.name
  };

  // NOTE: Prevent overriding with blanks
  ["link", "profileID", "surveyID", "surveyName"].filter((key) => !record[key]).forEach((key) => {
    delete record[key];
  });

  return record;
}

// NOTE: Order Service uses COMPLETED, Recommendation/Xavier uses COMPLETE
export default function orderFromQuery(response) {
  if(response.errorMessage) { console.warn("order", response.errorMessage); } /* eslint-disable-line no-console */

  const {order} = response.data;
  if(!order) { return null; }

  const record = {
    assessments: order.assessments.map((assessment) => ({
      completed: assessment.status === "COMPLETED",
      id: assessment.id,
      loaded: false,
      loading: true,
      skipped: assessment.isSkipped,
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

  if(record.assessments.some(({skipped}) => skipped)) { record.status = "skipped"; }
  if(response.errorMessage) { record.errors = [response.errorMessage]; }
  return record;
}

// NOTE: Order Service uses COMPLETED, Recommendation/Xavier uses COMPLETE
export function orderFromRecommendation(response) {
  if(response.errors) {
    console.warn("xavier", response.errors); /* eslint-disable-line no-console */
    return {
      assessments: [],
      completed: false,
      errors: response.errors,
      status: "error",
      surveys: []
    };
  }

  const assessments = [];
  const surveys = [];
  const {
    cognitive,
    external,
    personality
  } = response.data.recommendation.prerequisites || {};

  if(personality && personality.assessmentId) {
    assessments.push({
      completed: personality.status === "COMPLETE",
      id: personality.assessmentId,
      skipped: personality.isSkipped,
      surveyID: personality.surveyId,
      surveyName: personality.surveyName,
      surveyType: "personality"
    });
    surveys.push({id: personality.surveyId, type: "personality"});
  }

  if(cognitive && cognitive.testId) {
    assessments.push({
      completed: cognitive.status === "COMPLETE",
      id: cognitive.testId,
      skipped: cognitive.isSkipped,
      surveyID: cognitive.surveyId,
      surveyName: cognitive.surveyName,
      surveyType: "cognitive"
    });
    surveys.push({id: cognitive.surveyId, type: "cognitive"});
  }

  if(external) {
    external.forEach((assessment) => {
      assessments.push({
        completed: assessment.status === "COMPLETE",
        id: assessment.assessmentId,
        link: assessment.signInUrl || assessment.assessmentTakerUrl,
        skipped: assessment.isSkipped,
        surveyID: assessment.surveyId,
        surveyName: assessment.surveyName,
        surveyType: "external"
      });
      surveys.push({id: assessment.surveyId, type: "external"});
    });
  }

  const order = {
    assessments,
    completed: assessments.every(({completed}) => completed),
    errors: response.errors,
    surveys
  };

  if(assessments.some(({skipped}) => skipped)) {
    order.status = "skipped";
  } else if(order.completed) {
    order.status = "completed";
  } else if(response.errors) {
    order.status = "error";
  } else {
    order.status = "incomplete";
  }

  return order;
}
