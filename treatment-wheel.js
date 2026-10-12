'use strict';
(() => {
  const form = document.getElementById('calculator');
  const wheel = document.querySelector('.treatment-options');
  const choices = [...wheel.querySelectorAll('.treatment-choice')];
  // The first row holds the instruction, so the wheel starts on it until a treatment is chosen.
  const placeholder = document.createElement('div');
  placeholder.className = 'wheel-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  placeholder.textContent = 'Scroll to choose';
  wheel.prepend(placeholder);
  wheel.classList.add('treatment-wheel');
  wheel.setAttribute('role', 'listbox');
  wheel.setAttribute('aria-label', 'Heat treatment shown on the report');
  wheel.tabIndex = 0;
  let syncing = false, timer;
  const rowHeight = () => choices[0].getBoundingClientRect().height;
  choices.forEach((choice, index) => {
    choice.id = `treatment-option-${index}`;
    choice.setAttribute('role', 'option');
    choice.querySelector('input').tabIndex = -1;
  });
  function paint() {
    choices.forEach(choice => {
      const active = choice.querySelector('input').checked;
      choice.classList.toggle('treatment-selected', active);
      choice.setAttribute('aria-selected', String(active));
      if (active) wheel.setAttribute('aria-activedescendant', choice.id);
    });

  }
  function select(index) {
    const radio = choices[index].querySelector('input');
    if (!radio.checked) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', {bubbles:true}));
    }
    paint();
  }
  function clear() {
    const radio = choices.map(choice => choice.querySelector('input')).find(input => input.checked);
    if (!radio) return;
    radio.checked = false;
    radio.dispatchEvent(new Event('change', {bubbles:true}));
    wheel.removeAttribute('aria-activedescendant');
    paint();
  }
  function settle() {
    if (syncing) return;
    const index = Math.min(2, Math.round(wheel.scrollTop / rowHeight()) - 1);
    if (index < 0) clear(); else select(index);
  }
  wheel.addEventListener('scroll', () => {clearTimeout(timer);timer=setTimeout(settle,140)}, {passive:true});
  wheel.addEventListener('scrollend', settle);
  choices.forEach((choice,index) => choice.addEventListener('click', event => {
    event.preventDefault();select(index);wheel.scrollTo({top:(index+1)*rowHeight(),behavior:'smooth'});
  }));
  wheel.addEventListener('keydown', event => {
    if (!['ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const old=choices.findIndex(choice=>choice.querySelector('input').checked);
    const next=event.key==='Home'?0:event.key==='End'?2:Math.max(0,Math.min(2,old+(event.key==='ArrowDown'?1:-1)));
    select(next);wheel.scrollTo({top:(next+1)*rowHeight(),behavior:'smooth'});
  });
  function sync() {
    syncing=true;clearTimeout(timer);
    const index=choices.findIndex(choice=>choice.querySelector('input').checked);
    wheel.scrollTop=(index+1)*rowHeight();
    wheel.removeAttribute('aria-activedescendant');paint();
    setTimeout(()=>syncing=false,200);
  }
  form.addEventListener('change',paint);
  form.addEventListener('reset',()=>setTimeout(sync,0));
  document.getElementById('try-example').addEventListener('click',()=>setTimeout(sync,0));
  sync();
})();
