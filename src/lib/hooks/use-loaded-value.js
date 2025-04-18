import {useRecoilValueLoadable} from "recoil";

export default function useLoadedValue(state) {
  const loadable = useRecoilValueLoadable(state);
  if(loadable.state !== "hasValue") { return null; }

  return loadable.contents;
}
