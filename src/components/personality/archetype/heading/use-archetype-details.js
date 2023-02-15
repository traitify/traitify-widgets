import {useEffect, useState} from "react";
import getDetail from "lib/common/get-detail";
import dig from "lib/common/object/dig";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";

export default function useArchetypeDetails() {
  const perspective = useOption("perspective");
  const results = useResults();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const personality = dig(results, "archetype");
    if(!personality) { setDetails(null); return; }

    const data = {badge: {}, personality, video: {}};

    if(perspective === "thirdPerson") {
      data.description = getDetail({name: "Hiring Manager Description", personality});
      data.headingKey = "personality_heading_third_person";
    } else {
      data.description = getDetail({name: "Candidate Description", personality});
      data.headingKey = "personality_heading";
    }

    data.badge.url = getDetail({name: "Paradox - Badge", personality});
    data.video.url = getDetail({name: "Paradox - Video", personality});

    if(data.video.url) {
      data.video.thumbnail = getDetail({name: "Paradox - Video - Thumbnail", personality});
      data.video.track = getDetail({name: "Paradox - Video - Text Track", personality});
    }

    setDetails(data);
  }, [perspective, results]);

  return details;
}
