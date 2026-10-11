# Mosslight project instructions

## Product goal

Mosslight should make planning a garden brief and make going outside the obvious next step. Keep the UI calm, useful on a phone, and light on screen time.

## Architecture

- This is a static, dependency-light HTML/CSS/JavaScript app. Render publishes the repository root using `render.yaml`.
- Gemma 4 is called through OpenRouter's chat completions API directly from the browser. Do not hard-code or persist API keys. Keep key entry session-only and explain that the user's garden details are sent to OpenRouter for inference.
- Preserve the deterministic built-in garden guide as a fallback when the API is unavailable or rate limited.

## Garden guidance

- Never invent local weather, frost dates, or precise planting calendars. Use only the user's optional frost date and stated location, and remind them to confirm local conditions.
- Keep recommendations beginner-friendly and consistent with the selected light and growing space.
- Treat generated text as untrusted content: render it as text, never as HTML.

## Changes and review

- Keep dependencies and build steps minimal so Render can serve the app as a static site.
- Retain mobile layout, keyboard-accessible controls, reduced-motion support, and visible loading/fallback states.
- When editing the model path, preserve OpenRouter chat completions response parsing and keep the model ID centralized.
- Explain model, API-key, privacy, and deployment tradeoffs in the README. Do not claim the app works offline while generation relies on OpenRouter.
