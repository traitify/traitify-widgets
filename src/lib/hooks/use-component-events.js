export default function useComponentEvents(name, context) {
  const listener = useListener();

  useDidMount(() => { listener.trigger(`${name}.initialized`, context); });
  useDidUpdate(() => { listener.trigger(`${name}.updated`, context); });
}
