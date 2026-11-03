import useOption from "lib/hooks/use-option";

export default function useDisabledComponents(...names) {
  const option = useOption("disabledComponents");
  const disabledComponents = Array.isArray(option) ? option : [];

  return names.some((name) => disabledComponents.some((disabled) => (
    name === disabled || name.startsWith(`${disabled}.`)
  )));
}
