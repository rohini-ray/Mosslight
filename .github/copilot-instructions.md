# Mosslight project instructions

## Product goal

Mosslight should make planning a garden brief and make going outside the obvious next step. Keep the UI calm, useful on a phone, and light on screen time.

## Architecture

- This is a static, dependency-light HTML/CSS/JavaScript app. Render publishes the repository root using `render.yaml`.
- Gemma 3 270M is loaded on demand in the browser with Transformers.js. Model inference must stay client-side; never add a hosted inference API or send a user's location, frost date, or garden preferences to a server.
- Preserve the deterministic built-in garden guide as a fallback when the model is unavailable.
- Model files are large. Do not preload them on page load; keep the first-use download explicit and defer inference until the user requests a plan.

## Garden guidance

- Never invent local weather, frost dates, or precise planting calendars. Use only the user's optional frost date and stated location, and remind them to confirm local conditions.
- Keep recommendations beginner-friendly and consistent with the selected light and growing space.
- Treat generated text as untrusted content: render it as text, never as HTML.

## Changes and review

- Keep dependencies and build steps minimal so Render can serve the app as a static site.
- Retain mobile layout, keyboard-accessible controls, reduced-motion support, and visible loading/fallback states.
- When editing the model path, preserve the Transformers.js-compatible Gemma model and verify response parsing for chat-style generated messages.
- Use Render pull request previews for visual review. Explain any model, privacy, or deployment tradeoffs in the README.
