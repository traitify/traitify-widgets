import except from "./except";

export default function remap(object, mapping) {
  const existingKeys = Object.keys(mapping);

  return existingKeys.reduce(
    (newObject, key) => ({...newObject, [mapping[key]]: object[key]}),
    except(object, existingKeys)
  );
}
