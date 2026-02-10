# Debugging: Blank Screen When Prerequisites Are Already Complete

When candidates have **already completed** the prerequisites for a recommendation (benchmark + profile flow), the widget can show a **blank screen** instead of results. This doc explains why that happens and how to track it down.

---

## How the flow works when prerequisites are complete

1. **Xavier recommendation** returns `prerequisites` with `personality.status === "COMPLETE"` (and/or cognitive/external).
2. **orderFromRecommendation** builds an order with `assessments` (all completed) and `order.completed === true`.
3. **useOrderEffect** sets **active** to the **personality** assessment when `order.completed` (so the app shows “personality results”).
4. **Default** renders **Results** because `active.completed === true`.
5. **Results** uses **useResults({ surveyType: "personality" })** to load personality results.
6. **useResults** → **completedAssessmentQuery** → **personalityAssessmentQuery(assessment.id)** → **GET /assessments/:id** (REST, not GraphQL).

If **any** of these fail or return nothing, **Results returns `null`** → user sees a blank screen (no loading UI, no error message).

---

## Causes that produce a blank screen

### 0. **Listener overwriting or buggy event handlers (high suspicion when docs are followed)**

When prerequisites are **already complete**, the widget fires **`Surveys.finished`** (and **`Survey.finished`**) from **use-order-effect** as soon as the order is loaded and `order.completed === true`. Those are the exact events the docs show for “all surveys done” and “each survey done.”

**`listener.trigger()` invokes every registered callback synchronously.** If the third party:

- **Overwrites** `Traitify.listener` (or replaces `.on` / `.trigger`) with a custom object that doesn’t implement the same API, the widget can throw when it calls `listener.on(...)` (e.g. in **useListenerEffect**) or `listener.trigger(...)` (e.g. in **use-order-effect**). That can break the React tree or hit an error boundary → blank.
- **Registers a handler** for **`Surveys.finished`** or **`Survey.finished`** that:
  - **Throws** → the exception propagates out of `listener.trigger()` during the widget’s `useEffect` → React can unmount or show an error boundary → blank.
  - **Redirects** (`window.location = ...`) or **unmounts** the widget container → user sees blank (or a new page) instead of results.
  - **Clears the DOM** or does other destructive work → blank.

So **overwriting the listeners from the documentation, or adding handlers that throw/redirect/unmount, can absolutely explain a blank screen when prerequisites are already complete** — because that’s exactly when **Surveys.finished** is fired.

**What to check**

- Do they **replace** `Traitify.listener` or override `.on` / `.trigger`? If yes, the replacement must support the same API (including returning an unsubscribe function from `.on()`).
- For **`Traitify.listener.on("Surveys.finished", …)`** (and **`Survey.finished`**): does the handler ever throw, redirect, or remove the widget container? If so, run that path in isolation (e.g. redirect only after a timeout, or in a separate microtask) so it doesn’t run **inside** the widget’s `trigger()` call.
- Temporarily **remove or comment out** their **Surveys.finished** / **Survey.finished** handlers and reload with “prerequisites already complete.” If the blank goes away, the handlers (or listener overwriting) are the cause.

**Code reference:** `listener.trigger(key, value)` calls `this.callbacks[key].forEach((callback) => callback(value))` with no try/catch — any thrown error escapes and can break the widget. **use-order-effect** calls `listener.trigger("Surveys.finished", { assessments, order })` when `order.completed` is true.

---

### 1. **Personality results still loading (most common)**

- **useResults** uses **useLoadedValue(completedAssessmentQuery)**.
- **useLoadedValue** returns **`null`** whenever the query is not **"hasValue"** (i.e. while **loading** or on **error**).
- **Results** does `if (!results) return null;` → nothing is rendered.
- There is **no loading spinner** inside Results; it just stays blank until the request finishes.

So candidates see blank for as long as **GET /assessments/:id** is in flight (and forever if that request never completes or errors).

**What to check**

- In DevTools → Network: is **GET /assessments/{id}** called and does it eventually return 200 with assessment JSON?
- If it’s slow or never fires, the third party may need to show their own loading state until `Results.initialized` (or until `Surveys.finished` + a short delay).

---

### 2. **GET /assessments/:id fails (404, 401, CORS, wrong host)**

- The widget uses **personality.assessmentId** from the recommendation as the `id` in **GET /assessments/:id**.
- If that request fails (wrong host, auth, CORS, or invalid id), the Recoil selector can throw or resolve to nothing → **useLoadedValue** stays `null` → Results stays blank.

**What to check**

- Network tab: **GET /assessments/{personalityAssessmentId}** — status code and response body.
- Confirm the request uses the same **host** and **auth** as the rest of the app (Traitify options / HTTP client).
- Confirm **personality.assessmentId** in the Xavier response matches the assessment that’s actually completed for that profile.

---

### 3. **No personality in the recommendation (external-only flow)**

- **orderFromRecommendation** only adds a “personality” assessment when **personality && personality.assessmentId**.
- When `order.completed`, **useOrderEffect** picks the active assessment with:  
  `order.assessments.find(({ surveyType }) => surveyType === "personality") || order.assessments[0]`.
- If there is **no personality** in prerequisites (e.g. only external, or personality without `assessmentId`), **active** becomes the **first** assessment (e.g. external).
- **Results** only renders content for **personality** and **cognitive**. For **external** it does `if (active.surveyType !== "personality") return null;` → blank.

So when “prerequisites are complete” but **only external** (and no personality), the app goes to Results, sets active to external, and Results correctly returns null → blank.

**What to check**

- Inspect **order.assessments** and **active** when the blank appears:
  - Is there an assessment with `surveyType === "personality"`?
  - Is **active.surveyType** `"personality"` or `"external"`?
- If the third party only ever has external prerequisites, they may need to:
  - Not use the “results” view for that flow, or
  - Handle “all external complete” in their own UI instead of relying on Results.

---

### 4. **Missing or invalid personality.assessmentId**

- Order is built only when **personality && personality.assessmentId**.
- If Xavier returns prerequisites with **personality** but **no assessmentId** (or null), that personality is **not** added to `order.assessments`.
- Same outcome as (3): no personality in the order, active can be external/cognitive-only → Results returns null for “non-personality” or has no completed personality for **useResults**.

**What to check**

- Recommendation response: does **prerequisites.personality.assessmentId** exist and look like a valid assessment id?
- If the backend omits it when “already complete,” the widget has no id to call **GET /assessments/:id** and will show blank for personality results.

---

### 5. **Wrong API base URL / auth for assessment fetch**

- **personalityAssessmentQuery** uses **http** from Recoil (Traitify’s HTTP client).
- If the third party mounts the widget in a context where **host** or **auth** is wrong for **GET /assessments/:id**, that request will fail and Results stays null.

**What to check**

- How the third party passes **Traitify.options** / **authKey** / **host** when embedding.
- Ensure **GET /assessments/:id** is sent to the same environment (e.g. production vs staging) and with the same credentials as the Xavier call.

---

## Quick diagnostic checklist

0. **Listeners (check this first if they use documented events)**
   - Do they register **`Surveys.finished`** or **`Survey.finished`**? If yes, does that handler throw, redirect, or unmount the widget?
   - Do they replace **`Traitify.listener`** or override **`.on`** / **`.trigger`**? If yes, does the replacement support the same API?

1. **Network**
   - Is **GET /assessments/{id}** called? What are status and body?
   - Is **POST …/xavier/graphql** (recommendation) returning `prerequisites` with **personality.assessmentId** and **personality.status === "COMPLETE"**?

2. **State when blank**
   - **order.assessments**: Is there an item with `surveyType === "personality"` and `completed === true`?
   - **active**: Is `active.surveyType === "personality"` when the blank appears?
   - **useResults** / **completedAssessmentQuery**: Is the personality assessment fetch still loading or throwing? (useLoadedValue returns null in both cases.)

3. **Recommendation payload**
   - For “prerequisites already complete,” does the recommendation include **personality** with **assessmentId**?
   - If the backend returns a different shape when everything is complete (e.g. no personality, or no ids), that will match causes (3) or (4).

4. **Environment**
   - Same host/auth for Xavier and for **GET /assessments/:id**?
   - CORS / network not blocking the assessment request in the third party’s domain?

---

## Code references

| What | Where |
|------|--------|
| Results returns null when no personality results | `src/components/results/index.js` — `if (!results) return null;` |
| useResults returns null while loading/error | `src/lib/hooks/use-loaded-value.js` — returns null when `loadable.state !== "hasValue"` |
| Personality data comes from GET /assessments/:id | `src/lib/recoil/assessment.js` — `personalityAssessmentQuery` |
| Order built from recommendation prerequisites | `src/lib/common/order-from-query.js` — `orderFromRecommendation`, uses `personality.assessmentId` |
| Active set to personality when order complete | `src/components/container/hooks/use-order-effect.js` — `order.assessments.find(surveyType === "personality") \|\| order.assessments[0]` |
| No loading UI in Results | Results has no loading branch; it only checks `!results` and returns null |
| Surveys.finished / Survey.finished fired when order complete | `src/components/container/hooks/use-order-effect.js` — `listener.trigger("Surveys.finished", …)` / `listener.trigger("Survey.finished", …)`; triggers run handlers synchronously with no try/catch |
| Listener trigger invokes all callbacks | `src/lib/listener.js` — `trigger` does `this.callbacks[key].forEach((callback) => callback(value))` |

---

## Suggested fixes for the third party

1. **Listener / event handlers**
   - **Do not** replace `Traitify.listener` or override `.on` / `.trigger` unless the replacement preserves the full API (including returning an unsubscribe from `.on()`).
   - For **`Surveys.finished`** / **`Survey.finished`**: ensure the handler **never throws** and does **not** redirect or unmount the widget **synchronously** inside the callback. If they need to redirect or hide the widget, do it **after** the widget’s turn (e.g. `setTimeout(() => { ... }, 0)` or `queueMicrotask(...)`), so it runs after `listener.trigger()` returns.
   - As a **test**: comment out or remove their **Surveys.finished** and **Survey.finished** handlers. If the blank goes away when prerequisites are already complete, the cause is listener overwriting or those handlers.

2. **Loading state**
   - Listen for **Surveys.finished** or **Results.initialized** and show their own “Loading results…” until they’re sure results have loaded (e.g. a short delay or a follow-up health check).

3. **Validate recommendation and order**
   - Ensure **prerequisites.personality.assessmentId** is present and correct when prerequisites are complete.
   - If they only use external (or no personality), don’t rely on the widget’s Results view for that case; handle it in their own UI.

4. **Environment and auth**
   - Verify **GET /assessments/:id** uses the intended host and auth (same as used for Xavier and the rest of Traitify).

5. **Error handling**
   - If the assessment request fails, the widget has no built-in error UI; it just stays blank. They may want to use **Surveys.finished** (or **Results.initialized**) plus a timeout, and show “Unable to load results” if nothing renders after a few seconds.
