import dig from "lib/common/object/dig";
import useOptions from "lib/hooks/use-options";

export default function useOption(...keys) {
  const options = useOptions();

  return dig(options, ...keys);
}
