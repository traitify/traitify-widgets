import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import useListener from "lib/hooks/use-listener";

export default function useComponentEvents(name, context) {
  const listener = useListener();

  useDidMount(() => { listener.trigger(`${name}.initialized`, context); });
  useDidUpdate(() => { listener.trigger(`${name}.updated`, context); });
}
