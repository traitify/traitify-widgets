import {useSetRecoilState} from "recoil";
import {errorsToText, getResponseErrors} from "lib/common/errors";
import {appendErrorState} from "lib/recoil";

export default function useStartAssessment({key}) {
  const appendError = useSetRecoilState(appendErrorState);
  const trigger = async({assessment, request}) => {
    if(!assessment) { return; }
    if(assessment.startedAt) { return; }

    const response = await request().catch((e) => ({errors: getResponseErrors(e)}));
    if(response.errors) {
      console.warn(key, response.errors); /* eslint-disable-line no-console */
      appendError(errorsToText(key, getResponseErrors(response)));
    }
  };

  return {trigger};
}
