import useOption from "lib/hooks/use-option";

export default function useDisabledComponents(name) {
  const disabledComponents = useOption("disabledComponents") || [];

  return disabledComponents.includes(name);
}
