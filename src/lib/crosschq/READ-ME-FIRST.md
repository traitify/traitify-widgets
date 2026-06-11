# Crosschq Interview Report Widget — update (v0.2.1)

This build addresses the two issues you raised: CSS collisions with the host
page, and a path toward smaller integration footprint. v0.2.1 also fixes the
tooltip styling you spotted with the scoped build.

## What changed

1. **All CSS is namespaced under `.crosschq-widget`.**
   Every selector in `crosschq-widget.css` — Tailwind's preflight reset
   (`*`, `html`, `body`), the utility classes (`.flex` → `.crosschq-widget .flex`),
   and the theme variables (`:root` → `.crosschq-widget`) — is now scoped to the
   widget's own container. The widget no longer restyles your page, and a host
   using Bootstrap / another Tailwind / theme overrides won't collide with it.
   The added `.crosschq-widget` specificity also means host styles rarely win
   over the widget's. (Gzip cost of the scoping: ~1.5 KB.)

2. **New `render({ shadow: true })` for full isolation.**
   Mounts the widget inside a shadow root, so host CSS cannot reach in and the
   widget's cannot leak out under any specificity. The widget auto-attaches
   `crosschq-widget.css` inside the shadow root by detecting the stylesheet you
   already load; override the URL with `cssHref` if needed.

   ```js
   CrosschqWidget.render({ interviewID, target, reportData, shadow: true });
   ```

3. **Tooltips stay styled in both modes.** The widget gives reka-ui a
   `.crosschq-widget` teleport container (in the shadow root under `shadow:true`,
   otherwise in `document.body`), so tooltip content keeps its styles even though
   it portals out of the component tree — fixing the unstyled-tooltip issue from
   the first scoped build.

See **`INTEGRATION.md` → "CSS scoping"** for the full details.

## Try the demo

```bash
cd _demo
npx serve .
```

Open the printed URL → `index.html`. In **Push** mode, paste the contents of
`sample-report.json` into the "Report JSON" box and click **Render report**.

## Files

| File | What it is |
|------|------------|
| `crosschq-widget.umd.js` | UMD build — plain `<script src>`. Exposes `window.CrosschqWidget`. |
| `crosschq-widget.es.js`  | ESM build — `import { render } from "@crosschq/widget"`. |
| `crosschq-widget.css`    | Styles — every selector scoped under `.crosschq-widget`. |
| `sample-report.json`     | A sample report payload for the demo (push mode). |
| `INTEGRATION.md`         | The full contract: API, push/pull modes, CSS scoping, examples. |
| `_demo/`                 | Runnable plain-HTML + React demos. |

Questions: **isaias.caporusso@crosschq.com**
