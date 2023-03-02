import {useMemo} from "react";
import dig from "lib/common/object/dig";
import useResults from "lib/hooks/use-results";

export default function usePersonality() {
  const results = useResults();

  return useMemo(() => {
    if(!results) { return null; }
    if(results.archetype) { return results.archetype; }
    if(results.personality_blend) { return results.personality_blend; }

    return dig(results, "personality_types", 0, "personality_type");
  }, [results]);
}
