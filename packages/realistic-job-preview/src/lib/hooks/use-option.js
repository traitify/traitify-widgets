import useWidgetContext from "./use-widget-context";

export default function useOption(key) {
  const {options} = useWidgetContext();

  return options ? options[key] : null;
}
