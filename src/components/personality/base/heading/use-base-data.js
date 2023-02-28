import {useMemo} from "react";
import getDetail from "lib/common/get-detail";
import useOption from "lib/hooks/use-option";
import usePersonality from "lib/hooks/use-personality";

export default function useBaseData() {
  const personality = usePersonality();
  const perspective = useOption("perspective");

  return useMemo(() => {
    if(!personality) { return null; }

    const data = {
      badge: {},
      description: personality.description,
      name: personality.name.split("/").map((name) => name.trim()).join(" | "),
      perspective,
      video: {}
    };

    if(personality.personality_type_1) {
      data.headingKey = "personality_blend_heading";

      [1, 2].forEach((index) => {
        const type = personality[`personality_type_${index}`];
        const url = getDetail({name: "Paradox - Badge", personality: type});

        if(url) { data.badge[`image_${index}`] = {alt: type.name, url}; }
      });
    } else {
      data.headingKey = "personality_base_heading";

      const url = getDetail({name: "Paradox - Badge", personality});
      if(url) { data.badge = {alt: personality.name, url}; }
    }

    data.video.url = getDetail({name: "Paradox - Video", personality});
    if(data.video.url) {
      data.video.thumbnail = getDetail({name: "Paradox - Video - Thumbnail", personality});
      data.video.track = getDetail({name: "Paradox - Video - Text Track", personality});
    }

    if(perspective === "thirdPerson") { data.headingKey += "_third_person"; }

    return data;
  }, [personality, perspective]);
}
