import getDetail from "lib/common/get-detail";
import dig from "lib/common/object/dig";
import useResults from "lib/hooks/use-results";

export default function useArchetypeDetails() {
  const perspective = useOption("perspective");
  const results = useResults();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const personality = dig(results, "archetype");
    if(!personality) { setDetails(null); return; }

    const details = {badge: {}, personality, video: {}};

    if(perspective === "thirdPerson") {
      details.description = getDetail({name: "Hiring Manager Description", personality});
      details.headingKey = "personality_heading_third_person";
    } else {
      details.description = getDetail({name: "Candidate Description", personality});
      details.headingKey = "personality_heading";
    }

    details.badge.url = getDetail({name: "Paradox - Badge", personality});
    details.video.url = getDetail({name: "Paradox - Video", personality});

    if(details.video.url) {
      details.video.thumbnail = getDetail({name: "Paradox - Video - Thumbnail", personality});
      details.video.track = getDetail({name: "Paradox - Video - Text Track", personality});
    }

    setDetails(details);
  }, [perspective, results]);

  return details;
}
