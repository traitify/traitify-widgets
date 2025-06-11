import {useEffect, useState} from "react";
import useAssessment from "lib/hooks/use-assessment";

export default function Generic() {
  const assessment = useAssessment({surveyType: "generic"});
  return (
    <h1>Generic</h1>
  );
}
