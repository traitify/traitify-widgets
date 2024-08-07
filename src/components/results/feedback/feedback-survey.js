export const getIsUserCompletedFeedback = async(assessmentId, http) => {
  if(!assessmentId) { return true; }
  return http.get(`/feedback/assessments/${assessmentId}/status`)
    .then((resp) => resp?.status === "complete")
    .catch((e) => {
      console.error("Failed to check if user completed feedback"); /* eslint-disable-line no-console */
      console.error(e); /* eslint-disable-line no-console */
      return true;
    });
};

export const submitFeedbackSurveyResponse = async(assessmentId, response, http) => http.post(`/feedback/assessments/${assessmentId}`, response)
  .catch((e) => {
    console.error("Failed to submit feedback survey response"); /* eslint-disable-line no-console */
    console.error(e); /* eslint-disable-line no-console */
  });

const notEmpty = (str) => str !== undefined && str !== "";

export const isResponsesValid = (responses) => {
  if(!responses) return false;

  return Object.values(responses).every(
    (r) => notEmpty(r.selected_option_id) || notEmpty(r.short_response)
  );
};
