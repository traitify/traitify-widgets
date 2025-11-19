export default function isBlank(string) {
  if(string == null) { return true; }
  if(string === "") { return true; }

  return false;
}
