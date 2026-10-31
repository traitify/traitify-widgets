import useDidMount from "lib/hooks/use-did-mount";
import useDidUpdate from "lib/hooks/use-did-update";
import useListener from "lib/hooks/use-listener";

export default function useComponentEvents(options, context) {
  const listener = useListener();
  // TODO: Remove in next major version
  const legacy = typeof options === "string";
  const name = legacy ? options : options.component;
  const payload = legacy ? context : options.context;

  useDidMount(() => {
    if(legacy) { listener.trigger(`${name}.initialized`, payload); }
    listener.trigger(`Component.${name}.initialized`, payload);
  });
  useDidUpdate(() => {
    if(legacy) { listener.trigger(`${name}.updated`, payload); }
    listener.trigger(`Component.${name}.updated`, payload);
  });
}
