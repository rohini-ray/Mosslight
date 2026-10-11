const MODEL_ID = 'onnx-community/gemma-3-270m-it-ONNX';
const statusEl = document.querySelector('#model-status');
const form = document.querySelector('#garden-form');
const button = document.querySelector('.submit-button');
let generatorPromise;

async function getGenerator() {
  if (!generatorPromise) {
    generatorPromise = import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0')
      .then(({ pipeline, env }) => {
        env.allowLocalModels = false;
        return pipeline('text-generation', MODEL_ID, { dtype: 'q4f16' });
      });
    generatorPromise.catch(() => { generatorPromise = undefined; });
  }
  return generatorPromise;
}

function planPrompt(data) {
  const frost = data.frost ? `The user's last frost date is ${data.frost}.` : 'The last frost date is unknown, so avoid suggesting tender plants outdoors.';
  return `You are Mosslight, a kind, practical garden coach. Make a very short plan for a beginner. Context: place ${data.location}; growing space ${data.space}; light ${data.sun}; interest ${data.interest}; preferred effort ${data.pace}. ${frost} Give exactly four numbered steps: one ten-minute outdoor action today, one suitable beginner plant or seed, one simple care tip, and one reminder to check local frost conditions. Never invent local weather or frost dates. Keep each step to one sentence. Under 85 words.`;
}

function fallbackPlan(data) {
  const seeds = data.interest.includes('flowers') ? 'calendula or native pollinator-friendly flowers' : data.interest.includes('vegetables') ? 'leafy greens such as lettuce or spinach' : 'a forgiving herb such as chives or parsley';
  const light = data.sun.startsWith('full') ? 'Choose a spot that gets the most direct light.' : data.sun.startsWith('partial') ? 'Put your pot where it catches the brightest part of the day.' : 'Try shade-friendly greens like spinach or mint.';
  return `1. Take ten minutes outside today to clear one pot or a small patch. Notice where the light lands.\n\n2. Try ${seeds} in a container with drainage. Check the seed packet for your season and sowing depth.\n\n3. ${light} Water when the top inch of soil feels dry, not by the calendar.\n\n4. If nights are still cold near ${data.location}, start seeds indoors or wait until frost danger has passed.`;
}

function collectForm() {
  return {
    location: document.querySelector('#location').value.trim(),
    space: document.querySelector('#space').value,
    sun: document.querySelector('#sun').value,
    interest: document.querySelector('#interest').value,
    pace: document.querySelector('#pace').value,
    frost: document.querySelector('#frost-date').value,
  };
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = collectForm();
  button.disabled = true;
  button.querySelector('.button-label').textContent = 'WAKING GEMMA…';
  statusEl.textContent = 'Loading Gemma on your device';
  let plan;
  let usedModel = false;
  try {
    const generate = await getGenerator();
    const result = await generate([{ role: 'user', content: planPrompt(data) }], { max_new_tokens: 128, temperature: 0.65, do_sample: true, repetition_penalty: 1.12 });
    const generated = result?.[0]?.generated_text;
    plan = Array.isArray(generated)
      ? generated.filter((message) => message.role === 'assistant').at(-1)?.content?.trim()
      : generated?.trim();
    if (!plan || plan.length < 40) throw new Error('The model returned an incomplete plan.');
    usedModel = true;
    statusEl.textContent = 'Gemma is ready on this device';
  } catch (error) {
    console.warn('Local model unavailable; using the built-in garden guide.', error);
    plan = fallbackPlan(data);
    statusEl.textContent = 'Ready for a little garden planning';
    showToast('Using the built-in guide — Gemma needs its first download and a device with enough memory.');
  } finally {
    button.disabled = false;
    button.querySelector('.button-label').textContent = 'MAKE MY GARDEN PLAN';
  }
  document.querySelector('#plan-location').textContent = data.location.toUpperCase();
  document.querySelector('#plan-text').textContent = plan;
  document.querySelector('#model-credit').textContent = usedModel ? 'GEMMA 3 270M · ON DEVICE' : 'BUILT-IN GARDEN GUIDE · OFFLINE';
  const result = document.querySelector('#result');
  result.classList.remove('hidden');
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#edit-plan').addEventListener('click', () => {
  document.querySelector('#planner').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

let toastTimer;
function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 5200);
}
