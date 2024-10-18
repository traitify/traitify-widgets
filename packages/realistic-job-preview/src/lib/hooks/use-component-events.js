import useDidMount from "traitify/lib/hooks/use-did-mount";
import useDidUpdate from "traitify/lib/hooks/use-did-update";
import useWidgetContext from "./use-widget-context";

export default function useComponentEvents(name, context) {
  const {listener} = useWidgetContext();

  useDidMount(() => { listener.trigger(`${name}.initialized`, context); });
  useDidUpdate(() => { listener.trigger(`${name}.updated`, context); });
}
