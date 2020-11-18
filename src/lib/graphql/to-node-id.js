export default function toNodeID(type, id) {
  return btoa(unescape(encodeURIComponent(`${type}:${id}`)));
}
