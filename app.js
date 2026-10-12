'use strict';
const form = document.querySelector('#calculator');
const result = document.querySelector('#result');
const heading = document.querySelector('#result-heading');
const announcement = document.querySelector('#announcement');
const more = document.querySelector('#more-details');
const dialog = document.querySelector('#help-dialog');
const $ = (id) => document.getElementById(id);
const selected = (name) => form.elements[name].value;
const dollars = (value) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);

function clearErrors() {
  document.querySelectorAll('.field-error').forEach((node) => { node.hidden = true; });
  form.querySelectorAll('[aria-invalid]').forEach((node) => node.removeAttribute('aria-invalid'));
}
function hideResult() {
  result.hidden = true;
  announcement.textContent = '';
}
function updateGemFields() {
  $('other-gem-field').hidden = selected('gem') !== 'other';
  $('sapphire-colour-field').hidden = selected('gem') !== 'sapphire';
}
form.addEventListener('input', () => { hideResult(); clearErrors(); updateGemFields(); });
form.addEventListener('change', () => { hideResult(); clearErrors(); updateGemFields(); });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();
  const errors = [];
  const gem = selected('gem');
  const rawWeight = $('weight').value.trim();
  const weight = Number(rawWeight);
  const treatment = selected('treatment');
  if (!gem) errors.push(['gem-error', form.querySelector('.gem-wheel')]);
  if (gem === 'other' && !selected('otherGem')) errors.push(['other-error', $('choose-other-gem')]);
  if (!/^\d+(?:\.\d+)?$/.test(rawWeight) || !Number.isFinite(weight) || weight <= 0 || weight > 99.99) {
    $('weight-error').textContent = weight > 99.99 ? 'For this demo, enter a weight up to 99.99 carats.' : 'Enter a weight greater than 0 carats, using numbers only.';
    errors.push(['weight-error', $('carat-whole')]);
  }
  if (!treatment) errors.push(['treatment-error', form.querySelector('.treatment-wheel')]);
  if (errors.length) {
    errors.forEach(([id, input]) => { $(id).hidden = false; input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', input.id === 'carat-whole' ? `weight-help ${id}` : id); });
    errors[0][1].focus();
    announcement.textContent = 'Please check the highlighted details.';
    return;
  }
  const supported = gem === 'sapphire' && treatment === 'heated' && selected('sapphireColour') === 'blue' && selected('colour') === 'medium' && selected('clarity') === 'clean' && selected('cut') === 'good';
  $('price-card').hidden = !supported;
  $('unknown-card').hidden = supported;
  $('result-summary').hidden = !supported;
  if (supported) {
    $('price-label').textContent = `Total for your ${dollars(weight)}-carat gem`;
    $('price-value').textContent = `USD ${dollars(400 * weight)}–${dollars(600 * weight)}`;
    $('per-carat').textContent = 'Per carat: USD 400–600';
    $('result-summary').textContent = 'Blue sapphire · Heated · Medium colour · No visible marks · Good sparkle';
    announcement.textContent = `Sample total: USD ${dollars(400 * weight)} to ${dollars(600 * weight)}. This is not a market quote.`;
  } else {
    const unsupportedGem = gem !== 'sapphire' || selected('sapphireColour') === 'other';
    $('unknown-title').textContent = unsupportedGem ? 'This gem needs expert advice' : 'A few more details are needed';
    $('unknown-message').textContent = unsupportedGem
      ? 'This demo only has an illustrative example for blue sapphire. We do not have sample prices for your gem. A gem professional can help.'
      : 'This demo only shows a price for its filled-in example: a blue, heated sapphire with medium colour, no visible marks and good sparkle. Keep unknown details as “I do not know”; do not guess a grade to get a price. You can explore the illustrative calculation through Help → Try a filled-in example.';
    announcement.textContent = $('unknown-title').textContent;
  }
  result.hidden = false;
  heading.focus({ preventScroll: true });
  result.scrollIntoView({ block: 'start' });
});
$('update-details').addEventListener('click', () => {
  more.open = true;
  more.scrollIntoView({ block: 'start' });
  more.querySelector('summary').focus({ preventScroll: true });
});
$('reset-button').addEventListener('click', () => {
  form.reset();
  $('weight').value = '0.00';
  more.open = false;
  clearErrors();
  hideResult();
  updateGemFields();
  form.querySelector('.gem-wheel').focus({ preventScroll: true });
  announcement.textContent = 'Calculator cleared. Start with your gem.';
});
$('help-button').addEventListener('click', () => dialog.showModal());
$('close-help').addEventListener('click', () => dialog.close());
$('try-example').addEventListener('click', () => {
  form.reset();
  form.querySelector('[name="gem"][value="sapphire"]').checked = true;
  $('weight').value = '2.00';
  form.querySelector('[name="treatment"][value="heated"]').checked = true;
  $('sapphire-colour').value = 'blue';
  $('colour').value = 'medium';
  $('clarity').value = 'clean';
  $('cut').value = 'good';
  more.open = true;
  updateGemFields();
  dialog.close();
  form.requestSubmit();
});
updateGemFields();
