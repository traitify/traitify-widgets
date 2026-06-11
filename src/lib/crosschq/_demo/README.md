# Runnable demos

Two host pages that render the widget so you can try it with zero setup.

- `index.html` — plain HTML host (uses the UMD build).
- `react.html` — React 18 host (React from CDN), simulating how the
  widget mounts inside a React app like Traitify's.

## Run

```bash
npx serve .
# open the printed URL, then index.html or react.html
```

Click **"Load sample data"** to render a bundled sample report with no
credentials. Or pick a Mode and provide your own pushed JSON / pull creds.

The `crosschq-widget.*` and `sample-*.json` files here are copies of the
deliverable one level up, kept so this folder serves standalone.

See `../INTEGRATION.md` for the full integration contract.
