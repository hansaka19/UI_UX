'use strict';
(() => {
  const wheel = document.querySelector('.gem-grid');
  const choices = [...wheel.querySelectorAll('.gem-choice')];
  const order = ['ruby', 'sapphire', 'emerald', 'other'];
  choices.sort((a, b) => order.indexOf(a.querySelector('input').value) - order.indexOf(b.querySelector('input').value));
  choices.forEach(choice => wheel.append(choice));
  wheel.classList.add('gem-wheel');
  wheel.setAttribute('role', 'listbox');
  wheel.setAttribute('aria-label', 'Gem type. Scroll up or down to choose.');
  wheel.tabIndex = 0;
  choices.forEach((choice, i) => {
    choice.setAttribute('role', 'option');
    choice.id = `gem-option-${i}`;
    choice.querySelector('input').tabIndex = -1;
  });
  const help = document.createElement('p');
  help.className = 'wheel-hint';
  help.textContent = 'Scroll up or down to choose';
  document.querySelector('.carat-picker').append(help);
  const height = 44;
  let timer, syncing = false;
  const refresh = () => {
    choices.forEach(choice => {
      const active = choice.querySelector('input').checked;
      choice.classList.toggle('wheel-selected', active);
      choice.setAttribute('aria-selected', String(active));
      if (active) wheel.setAttribute('aria-activedescendant', choice.id);
    });
  };
  const select = index => {
    const radio = choices[index].querySelector('input');
    if (!radio.checked) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    refresh();
  };
  const settle = () => {
    if (syncing) return;
    select(Math.max(0, Math.min(choices.length - 1, Math.round(wheel.scrollTop / height))));
  };
  wheel.addEventListener('scroll', () => {
    clearTimeout(timer);
    timer = setTimeout(settle, 120);
  }, { passive: true });
  wheel.addEventListener('scrollend', settle);
  choices.forEach((choice, index) => choice.addEventListener('click', event => {
    event.preventDefault();
    select(index);
    wheel.scrollTo({ top: index * height, behavior: 'smooth' });
  }));
  wheel.addEventListener('keydown', event => {
    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let index = choices.findIndex(choice => choice.querySelector('input').checked);
    index = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : Math.max(0, Math.min(choices.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)));
    select(index);
    wheel.scrollTo({ top: index * height, behavior: 'smooth' });
  });
  const sync = () => {
    const index = choices.findIndex(choice => choice.querySelector('input').checked);
    syncing = true;
    wheel.scrollTop = Math.max(0, index) * height;
    refresh();
    if (index < 0) wheel.removeAttribute('aria-activedescendant');
    setTimeout(() => { syncing = false; }, 180);
  };
  document.getElementById('calculator').addEventListener('change', refresh);
  document.getElementById('calculator').addEventListener('reset', () => setTimeout(sync, 0));
  document.getElementById('try-example').addEventListener('click', () => setTimeout(sync, 0));
  sync();
})();
