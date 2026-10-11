const MODEL_ID = 'google/gemma-4-26b-a4b-it:free';
const statusEl = document.querySelector('#model-status');
const form = document.querySelector('#garden-form');
const button = document.querySelector('.submit-button');
function planPrompt(data) {
  const frost = data.frost ? `The user's last frost date is ${data.frost}.` : 'The last frost date is unknown, so avoid suggesting tender plants outdoors.';
  return `You are Mosslight, a kind, practical garden coach. Make a very short plan for a beginner. Context: place ${data.location}; growing space ${data.space}; light ${data.sun}; interest ${data.interest}; preferred effort ${data.pace}. ${frost} Give exactly four numbered steps: one ten-minute outdoor action today, one suitable beginner plant or seed, one simple care tip, and one reminder to check local frost conditions. Never invent local weather or frost dates. Keep each step to one sentence. Under 85 words.`;
}

async function requestGardenPlan(data, apiKey) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_ID,
      messages: [
        { role: 'system', content: 'You are Mosslight, a kind, practical garden coach. Never invent local weather or frost dates. Keep advice beginner-friendly, concise, and safe for the stated space and sunlight. Return exactly four numbered steps under 85 words: one small outdoor action today, one suitable beginner plant or seed, one simple care tip, and one reminder to check local frost conditions.' },
        { role: 'user', content: planPrompt(data) },
      ],
      max_tokens: 160,
      temperature: 0.65,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `OpenRouter returned HTTP ${response.status}.`;
    throw new Error(response.status === 401 || response.status === 403 ? 'OpenRouter rejected this API key. Check the key and try again.' : message);
  }
  const text = payload?.choices?.[0]?.message?.content?.trim();
  if (!text || text.length < 40) throw new Error('Gemma returned an incomplete garden plan. Please try again.');
  return text;
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
  const apiKey = document.querySelector('#openrouter-key').value.trim();
  if (!apiKey) {
    showToast('Add your OpenRouter API key to ask Gemma 4 for a plan.');
    document.querySelector('#openrouter-key').focus();
    return;
  }
  button.disabled = true;
  button.querySelector('.button-label').textContent = 'WAKING GEMMA…';
  statusEl.textContent = 'Asking Gemma 4 through OpenRouter';
  let plan;
  let usedModel = false;
  try {
    plan = await requestGardenPlan(data, apiKey);
    usedModel = true;
    statusEl.textContent = 'Gemma 4 is ready when you are';
  } catch (error) {
    console.warn('OpenRouter garden-plan request failed.', error);
    plan = fallbackPlan(data);
    statusEl.textContent = 'Using the built-in garden guide';
    showToast(`${error.message} Showing the built-in guide instead.`);
  } finally {
    button.disabled = false;
    button.querySelector('.button-label').textContent = 'MAKE MY GARDEN PLAN';
  }
  document.querySelector('#plan-location').textContent = data.location.toUpperCase();
  document.querySelector('#plan-text').textContent = plan;
  document.querySelector('#model-credit').textContent = usedModel ? 'GEMMA 4 · OPENROUTER' : 'BUILT-IN GARDEN GUIDE · FALLBACK';
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
