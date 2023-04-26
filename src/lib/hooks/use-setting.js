import useSettings from "lib/hooks/use-settings";

export default function useSetting(name, options = {}) {
  const settings = useSettings() || {};
  if(!Object.hasOwn(settings, name)) { return options.fallback; }

  return settings[name];
}
