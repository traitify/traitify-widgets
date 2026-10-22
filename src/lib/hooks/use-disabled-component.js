import useOption from "lib/hooks/use-option";

export default function useDisabledComponents(...names) {
  const disabledComponents = useOption("disabledComponents") || [];

  return names.some((name) => disabledComponents.some((disabled) => (
    name === disabled || name.startsWith(`${disabled}.`)
  )));
}
