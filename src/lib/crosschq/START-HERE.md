# Crosschq Interview Report Widget — test package

A self-contained JS widget that renders a Crosschq interview report inside any
DOM element. This package lets you (Traitify) evaluate it in **plain HTML** and
**React** before we lock the integration.

## Try it in 60 seconds (no credentials needed)

```bash
# from inside this folder
cd _demo
npx serve .
```

Open the printed URL, then open either:

- **`index.html`** — plain-HTML host
- **`react.html`** — React 18 host (simulates how Traitify mounts the widget)

On either page, click **“Load sample data”** (top-right of the Mode bar). It
loads a bundled sample report and renders it immediately — no API host, no
token, no JSON to paste. That's the fastest way to see the widget working.

> Want to test with your own data? Switch **Mode** to *Push* and paste a report
> JSON, or *Pull* and enter an API host + bearer token. See `INTEGRATION.md`.

## What's in here

| Path | What it is |
|------|------------|
| `crosschq-widget.umd.js` | UMD build — for plain `<script src>` (no bundler). Exposes `window.CrosschqWidget`. |
| `crosschq-widget.es.js`  | ESM build — for `import { render } from "@crosschq/widget"` (React / Vite / Webpack / Rollup). |
| `crosschq-widget.css`    | Styles. Always load this alongside either JS build. |
| `sample-report.json`     | A sample report payload — what the “Load sample data” button uses (push mode). |
| `INTEGRATION.md`         | **The contract.** Full API, push vs pull modes, copy-paste React + `<script>` examples, proxy spec, CSS-scoping notes, known limits. |
| `_demo/index.html`       | Runnable **plain-HTML** host. |
| `_demo/react.html`       | Runnable **React 18** host. |

> The three `crosschq-widget.*` files at the root are the deliverable. The copies
> inside `_demo/` (incl. the sample JSON) exist only so the demos can be served
> standalone.

## Two data modes (both supported, your choice)

- **Push (recommended):** you fetch the report server-side (you already hold the
  org's Crosschq partner key) and hand the JSON to `render({ reportData })`.
  No browser credentials, no proxy.
- **Pull:** the widget fetches the report itself via a `/crosschq-proxy` you
  expose, using a bearer token. Useful when you can't fetch server-side.

You can mix them. See **`INTEGRATION.md` → "Two integration modes"** for the
full picture and code for each.

## Embedding, in one glance

**React (ESM, push):**
```jsx
import { render } from "@crosschq/widget";
import "@crosschq/widget/dist/crosschq-widget.css";

const handle = render({ interviewID, target: ref.current, reportData });
// on unmount: handle.destroy();
```

**Plain HTML (UMD, push):**
```html
<link rel="stylesheet" href="./crosschq-widget.css">
<script src="./crosschq-widget.umd.js"></script>
<div id="report"></div>
<script>
  window.CrosschqWidget.render({
    interviewID: "...",
    target: document.getElementById("report"),
    reportData: window.MY_REPORT_PAYLOAD,
  });
</script>
```

Full, authoritative examples (including pull mode and registering as a
`Traitify.Components` entry) live in **`INTEGRATION.md`**.

## Questions / API changes

**isaias.caporusso@crosschq.com**
