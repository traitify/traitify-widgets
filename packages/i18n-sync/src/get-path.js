import {dirname, join} from "node:path";
import {fileURLToPath} from "node:url";

export default function(path) {
  const __dirname = fileURLToPath(dirname(import.meta.url));

  return join(__dirname, `../../../${path}`);
}
