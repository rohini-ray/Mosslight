# Mosslight

**Make a plan. Close the screen. Go see what grows.**

Mosslight is a simple garden planner. Share your location, sunlight, and what you hope to grow; Gemma 4 turns that into a short plan for the week.

## Gemma 4 through OpenRouter

Mosslight uses `google/gemma-4-26b-a4b-it:free` through OpenRouter's chat completions API. The model is open-weight and available under Apache 2.0. The app sends the garden answers to OpenRouter to generate the plan, so this version requires an internet connection.

Visitors paste their own OpenRouter API key into the password field. Mosslight keeps it in the current page only: it does not save the key to local or session storage or add it to the repository. The browser sends the key and garden details to OpenRouter with each plan request. Use your own limited key and don't paste a shared or production credential into a public computer. The free model may have rate limits or temporary availability limits. If generation fails, Mosslight shows its built-in garden guide instead.

## Render

The app remains a static site on Render's global CDN; no model server or downloaded weights are needed. `render.yaml` declares the site and browser security headers. The site redeploys when changes are pushed to its linked branch. Render preview environments require a plan that supports them, so the Blueprint does not enable previews by default.

To deploy, push the repo to GitHub, GitLab, or Bitbucket, then choose **New → Blueprint** in Render and connect it. The Blueprint creates the `mosslight` static site. Open its `onrender.com` URL after the deployment reports **Live**.

## GitHub Copilot

`.github/copilot-instructions.md` gives Copilot repository context and explains the product's garden-safety, privacy, and frontend conventions. Copilot is a contributor tool; it is not embedded in the public webpage or used at runtime.

## Run locally

Serve this folder over HTTP, for example with `python -m http.server 8000`, then visit `http://localhost:8000`. You'll need an OpenRouter API key to generate a Gemma plan. No backend or model download is required.

## Post-ready note

Mosslight helps turn “I should start a garden” into one doable thing to do outside this week. It uses open-weight Gemma 4 through OpenRouter to make a short plan from your patch, sunlight, and interests. There’s no model download or server to run yourself. The tradeoff is that the answers go to OpenRouter and you need an API key; the app keeps that key only in the open page and never commits it. After the plan is ready, Mosslight tells you to close the tab and get growing.
