import {useEffect} from "react";

export default function useDidMount(run) {
  useEffect(() => run(), []);
}
