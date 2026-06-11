# Crosschq Interview Report Widget — Integration Guide

A self-contained JS widget that renders a Crosschq interview report inside any
DOM element. Designed to be consumed from the Traitify Widgets bundle to power
the Crosschq results section in Paradox / Olivia sidebars, following the
architecture proposed in Tom Prats' gist (`tomprats/f984fa50f1e80b3b0861d88a29c8aa1d`).

## Files in this bundle

| File | Format | When to use |
|------|--------|-------------|
| `crosschq-widget.es.js`  | ESM   | Bundler-based integration (Webpack, Vite, Rollup). Recommended. |
| `crosschq-widget.umd.js` | UMD   | Plain `<script src>` integration without a bundler. |
| `crosschq-widget.css`    | CSS   | Tailwind v4 + theme + defensive reset scoped to `.crosschq-widget`. |

All three are **self-contained**: Vue 3 runtime, TanStack Query, and all
report components are bundled inside `*.js`. No additional runtime
dependencies — drop in and use.

## Two integration modes

The widget supports two ways to get report data, picked at `render()` time
by which options you pass. Both render identical UI.

| Mode | When to use | Trade-offs |
|------|-------------|-----------|
| **Push** (recommended) | The host can fetch the report server-side (e.g. Traitify already calls Crosschq's partner API). | No proxy needed. No browser-side CSP concerns. Smaller runtime work (no fetch, no retries). Host owns caching and refetch. |
| **Pull** (legacy)      | The host can only provide browser-side credentials (a bearer token reachable from the browser). | Widget calls the API itself, with TanStack Query caching and error UI built in. Requires a proxy if the host CSP blocks direct calls to `interview.crosschq.com`. |

You can mix push and pull: any payload (`reportData`, `transcriptionData`)
provided via push is used as-is; payloads not pushed fall back to pull if
`apiHost` + `bearerToken` are also provided. Passing neither a `reportData`
push nor pull credentials throws.

### Video & Transcript tab

The widget renders a "Video & Transcript" tab in addition to the main report
**only when transcription data is available** — either pushed via
`transcriptionData` or pulled from the partner API. If neither source yields
data, the tab is hidden and the report renders as a single view.

## Public API

```ts
type RenderOptionsCommon = {
  /** UUID of the Crosschq interview. From `assessment.externalId` when
   *  `assessment.vendor === "crosschq"`. Used as a semantic identifier and
   *  in pull mode as the path segment of the report URL. */
  interviewID: string;

  /** DOM element to render into. Will become the root of the Vue app. */
  target: HTMLElement;
};

type RenderOptionsPush = RenderOptionsCommon & {
  /** Pre-fetched report payload. Must match the shape returned by
   *  `GET /interviews/{id}/report/` on the Crosschq partner API. */
  reportData: ReportPayload;

  /** Optional pre-fetched transcription payload. Must match the shape
   *  returned by `GET /v2/interviews/{id}/transcription/`. When provided,
   *  the widget renders a "Video & Transcript" tab alongside the report.
   *  Omit to render the report alone or to let pull mode fetch it. */
  transcriptionData?: TranscriptionPayload;
};

type RenderOptionsPull = RenderOptionsCommon & {
  /** Base URL for Crosschq API calls. In production this should be the
   *  Traitify proxy: `${Traitify.http.host}/crosschq-proxy`. */
  apiHost: string;

  /** Bearer token sent in `Authorization` header. In production this is
   *  the Traitify public key — the proxy validates it and re-authenticates
   *  to Crosschq with the org's secret key. */
  bearerToken: string;
};

type RenderOptions = RenderOptionsPush | RenderOptionsPull;

type RenderHandle = {
  /** Unmount the Vue app and clear its internal query cache. Call on
   *  parent component unmount to prevent memory leaks. */
  destroy: () => void;

  /** Tear down and remount with new options. Useful when the parent
   *  switches between interviews — or between push and pull mode. */
  update: (next: Partial<RenderOptions>) => RenderHandle;
};

function render(opts: RenderOptions): RenderHandle;
```

In **pull mode** the widget calls up to two endpoints at runtime:

```
GET ${apiHost}/interviews/${interviewID}/report/
  Authorization: Bearer ${bearerToken}

GET ${apiHost}/v2/interviews/${interviewID}/transcription/
  Authorization: Bearer ${bearerToken}
```

The transcription call is gated: when `transcriptionData` is pushed the
widget skips that endpoint entirely. If the transcription endpoint is not
exposed by the proxy, the report still renders — only the "Video &
Transcript" tab is hidden.

In **push mode** no network call leaves the widget — `reportData` and
optionally `transcriptionData` are the authoritative sources. Both modes
expect the standard Crosschq report payload
(`{ report_data: { sections: [...] } }`) and, when transcription is supplied,
the partner shape (`{ interview_type, transcription, recording_urls,
recording_url, recording_rotation, ... }`).

## Integration patterns

### Recommended: React + ESM, **push mode**

The Traitify backend already has the org's Crosschq partner API key. Fetch
the report there and hand the JSON to the widget — no proxy, no
browser-side credentials.

```jsx
import { useRef, useEffect, useState } from "react";
import { render as renderCrosschqReport } from "@crosschq/widget";
import "@crosschq/widget/dist/crosschq-widget.css";

export function CrosschqReportSection({ assessment }) {
  const ref = useRef(null);
  const [reportData, setReportData] = useState(null);

  // Fetch happens in Traitify infrastructure (server-side endpoint that
  // proxies to Crosschq with the org's partner key, then forwards the
  // payload to the browser).
  useEffect(() => {
    fetchCrosschqReport(assessment.externalId).then(setReportData);
  }, [assessment.externalId]);

  useEffect(() => {
    if (!ref.current || !reportData) return;

    const handle = renderCrosschqReport({
      interviewID: assessment.externalId,
      target:      ref.current,
      reportData,
    });

    return () => handle.destroy();
  }, [assessment.externalId, reportData]);

  return <div ref={ref} />;
}
```

### Alternative: React + ESM, **pull mode**

Use when the host cannot fetch server-side and must hand the widget
browser-reachable credentials. Requires the `crosschq-proxy` (see
[Proxy contract](#proxy-contract-crosschq-proxy) below).

```jsx
import { useRef, useEffect } from "react";
import { render as renderCrosschqReport } from "@crosschq/widget";
import "@crosschq/widget/dist/crosschq-widget.css";

export function CrosschqReportSection({ assessment }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const handle = renderCrosschqReport({
      interviewID: assessment.externalId,
      target:      ref.current,
      apiHost:     `${Traitify.http.host}/crosschq-proxy`,
      bearerToken: Traitify.http.authKey,
    });

    return () => handle.destroy();
  }, [assessment.externalId]);

  return <div ref={ref} />;
}
```

### Registering as a `Traitify.Components` entry

To make the widget callable through `Traitify.render(targets)` alongside
existing components (`Report.Candidate`, `Results.Personality.Type.List`, etc.):

```js
// src/components/crosschq/interview-report.js
import { useRef, useEffect } from "react";
import { render } from "@crosschq/widget";

export default function CrosschqInterviewReport() {
  const ref = useRef(null);
  // Reads assessment.externalId from Traitify's options or Container context.
  const interviewID = Traitify.options.assessmentID;

  useEffect(() => {
    if (!ref.current || !interviewID) return;
    const handle = render({
      interviewID,
      target: ref.current,
      apiHost: `${Traitify.http.host}/crosschq-proxy`,
      bearerToken: Traitify.http.authKey,
    });
    return () => handle.destroy();
  }, [interviewID]);

  return <div ref={ref} />;
}
```

```js
// src/components/index.js (add to the existing default export)
import CrosschqInterviewReport from "./crosschq/interview-report";

export default {
  // ...existing entries...
  Crosschq: {
    InterviewReport: CrosschqInterviewReport,
  },
};
```

Host then renders it like any other Traitify component:

```js
Traitify.render({
  "Report.Candidate":        "#candidate-report",
  "Crosschq.InterviewReport": "#crosschq-report",
});
```

### Fallback: `<script>` tag (UMD)

For environments without a bundler. Push mode:

```html
<link rel="stylesheet" href="https://cdn.example.com/crosschq-widget.css">
<script src="https://cdn.example.com/crosschq-widget.umd.js"></script>
<div id="report"></div>
<script>
  // reportData fetched however the host prefers (XHR, server-rendered into
  // a global, hand-pasted for demos, etc).
  const handle = window.CrosschqWidget.render({
    interviewID: "...",
    target: document.getElementById("report"),
    reportData: window.MY_REPORT_PAYLOAD,
  });
  // Later: handle.destroy();
</script>
```

Pull mode (legacy):

```html
<script>
  const handle = window.CrosschqWidget.render({
    interviewID: "...",
    target: document.getElementById("report"),
    apiHost: "https://api.traitify.com/crosschq-proxy",
    bearerToken: "<traitify-public-key>",
  });
</script>
```

## Proxy contract (`/crosschq-proxy`)

**Pull mode only.** Skip this section if you ship in push mode.

The widget assumes Traitify exposes a proxy at `${Traitify.http.host}/crosschq-proxy`
that:

1. Accepts `GET /interviews/{uuid}/report/` from the widget.
2. Optionally accepts `GET /v2/interviews/{uuid}/transcription/` to enable the
   "Video & Transcript" tab. If this path is not exposed, the widget falls back
   to rendering the report tab alone (no error surfaced).
3. Validates the incoming `Authorization: Bearer <traitify-public-key>`.
4. Re-authenticates to Crosschq using the organization's stored secret key.
5. Restricts requests to interview UUIDs that belong to the calling org
   (to avoid open enumeration via sequential IDs).
6. Returns the Crosschq report / transcription JSON verbatim.

For local development you can bypass the proxy and point `apiHost` directly
to `https://interview.crosschq.dev/api/` with a user JWT in `bearerToken`.

## CSS scoping

`crosschq-widget.css` has **two layers** with different scoping behavior — be
aware of both before integrating:

**Global (affects the host page):**
- **Tailwind v4 preflight** — base reset on `*`, `::before`, `::after`,
  `html`, `body`, and heading selectors. Standard cross-browser
  normalization (box-sizing, margin reset, list-style, etc.). This is
  unavoidable with Tailwind v4 today (the framework does not yet support
  scoped builds). For most hosts the preflight is a no-op or matches their
  own reset; for hosts that depend on browser-default `body` margins or
  unstyled headings it may visibly change rendering.
- **Tailwind utility classes** (`.text-foreground`, `.bg-card`, etc.) —
  tree-shaken to only what the widget uses, but the class names live in the
  global namespace. Hosts using their own CSS-utility framework with the
  same class names would collide.
- **Theme CSS variables** — defined on `:root` via `@theme`. If your host
  defines colliding `:root` vars (e.g. `--color-foreground`), they will be
  inherited. Open an issue and we can move them inside `.crosschq-widget`
  in v1.1.

**Scoped to `.crosschq-widget`:**
- All custom rules in `widget.css` itself (font-smoothing, defensive
  `box-sizing`, etc.).
- `<style scoped>` blocks from Vue components used by the widget — Vue's
  `data-v-*` attributes keep these isolated.

If host CSS conflicts cause real problems for your integration, file an
issue with a minimal repro and we'll consider one of: emitting a no-preflight
build, prefixing all utilities, or moving to Shadow DOM.

## Known limitations (v1)

- **Tooltip / Popover portals.** Reka-UI components inside the report
  (`Tooltip`, `Sheet`, `Dialog`) currently portal to `document.body`. They
  inherit theme vars from `:root` so they render correctly when no host
  conflict exists, but they escape the `.crosschq-widget` scope. We'll add
  a `portalContainer` option in v1.1 if needed.
- **Bearer-token auth only.** The widget does not yet support cookie auth
  or signed URLs — sufficient for the proxied flow, but worth noting.
- **`update()` does a full remount.** Acceptable for v1 since hosts rarely
  swap `interviewID` without unmounting first. Reactive in-place updates
  can be added later if needed.

## Versioning

The widget exports `window.CrosschqWidget.version` (also `import { version } from "@crosschq/widget"`)
so hosts can pin to a specific build. Semantic versioning will start at `1.0.0`
once the API is locked with Traitify.

## Support

For integration questions or to discuss API changes:
**isaias.caporusso@crosschq.com**
