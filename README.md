# Mosslight

**Make a plan. Close the screen. Go see what grows.**

Mosslight is a one-page, offline-first garden planner. It turns a few details about a person’s growing space into a simple plan for this week, then nudges them outside.

## Why Gemma

Mosslight runs Google's instruction-tuned, open-weight Gemma 3 270M model directly in the browser through Transformers.js and ONNX Runtime. Garden details are used in a prompt on the device and are not sent to a model API. The model can be inspected, replaced, or adapted without changing the gardening flow. Once its files are cached, inference can work without a server connection. If model loading fails or the device cannot run it, Mosslight has a small deterministic guide as a fallback.

The tradeoff is model size: the selected quantized ONNX weights are about 426 MB, plus the runtime. The app loads them only when the visitor asks for a plan and tells them about the one-time download first. Gemma is governed by Google's Gemma Terms of Use; review the [model card and terms](https://huggingface.co/onnx-community/gemma-3-270m-it-ONNX) before distributing a modified model.

## Why Render

The frontend is static, so Render serves it through its global CDN without an always-on inference server. Its included [`render.yaml`](./render.yaml) provisions the site as a Blueprint, enables automatic pull request previews, and applies browser security headers. Pushes to the connected branch update the live site; pull requests get preview URLs for review.

## Why GitHub Copilot

The repo includes [Copilot instructions](./.github/copilot-instructions.md) that describe the local-first architecture, safety boundaries for garden advice, and UI conventions. This gives Copilot a focused project context when contributors ask it to explain, extend, or review the app. Use the instructions as the starting point for a human-reviewed change; keep plant and frost advice grounded in the information the user supplied.

## Run locally

Serve this folder over HTTP, for example with `python -m http.server 8000`, then open `http://localhost:8000`. The first Gemma inference needs internet access to download the model and Transformers.js. Browser storage may cache those files for offline use on later visits. No model API key or application backend is required.

## Deploy on Render

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Render, choose **New → Blueprint** and connect the repository, or choose **New → Static Site** for a manual setup.
3. For a manual static site, use a blank build command and `.` as the publish directory. The included Blueprint already defines these values.
4. Deploy. Render publishes the site at its `onrender.com` URL. Open a pull request to get a Render preview before merging.

## Post-ready note

Mosslight is a pocket garden planner that puts Gemma on your side of the screen. It turns your patch, sunlight, and gardening mood into one small plan, then tells you to close the tab and step outside. The open Gemma weights run in your browser, so your garden details stay on your device and there’s no inference server to pay for or trust with your data. Render serves the lightweight frontend globally and spins up preview links for pull requests. GitHub Copilot gets project-specific instructions to help contributors improve it without losing the local-first promise. The first model download is the tradeoff; after that, Mosslight can work offline.
