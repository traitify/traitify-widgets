import {useRecoilValue} from "recoil";
import {cacheKeyState} from "lib/recoil";

export default function useCacheKey(...options) {
  return useRecoilValue(cacheKeyState(...options));
}
