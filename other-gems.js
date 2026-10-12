'use strict';
(() => {
  const form = document.getElementById('calculator');
  const modal = document.getElementById('other-gems-dialog');
  const select = document.getElementById('other-gem');
  const trigger = document.getElementById('choose-other-gem');
  const labels = Object.fromEntries([...select.options].map(option=>[option.value,option.textContent]));
  function refresh() {
    trigger.textContent = select.value ? `${labels[select.value]} · Change` : 'Choose another gemstone';
    modal.querySelectorAll('[data-gem]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.gem === select.value)));
  }
  const list = modal.querySelector('.other-gem-options');
  const allOptions = [...list.querySelectorAll('[data-gem]')];
  let options = allOptions;
  let pending = 'sapphire';
  let opening = false;
  let timer;
  const row = () => options[0].getBoundingClientRect().height;
  const primaryGems = ['ruby','sapphire','emerald','other'];
  list.classList.add('other-gem-wheel');
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Other gemstone. Scroll to choose.');
  list.tabIndex = 0;
  options.forEach((button, i) => {
    button.id = `other-option-${i}`;
    button.setAttribute('role', 'option');
    button.tabIndex = -1;
  });
  const hint = document.createElement('p');
  hint.className = 'other-wheel-hint';
  hint.textContent = 'Scroll up or down to choose';
  list.after(hint);
  const done = document.createElement('button');
  done.type = 'button';done.id = 'confirm-other-gem';
  done.className = 'primary-button';done.textContent = 'Done';hint.after(done);
  function paint() {
    options.forEach(button => {
      const active = button.dataset.gem === pending;
      button.classList.toggle('other-wheel-selected', active);
      button.setAttribute('aria-selected', String(active));
      if (active) list.setAttribute('aria-activedescendant', button.id);
    });
  }
  function choose(index) {
    pending = options[index].dataset.gem;paint();
  }
  function settle() {
    if (!opening) choose(Math.min(options.length - 1, Math.max(0, Math.round(list.scrollTop / row()))));
  }
  list.addEventListener('scroll', () => {clearTimeout(timer);timer=setTimeout(settle,120);}, {passive:true});
  list.addEventListener('scrollend',settle);
  list.addEventListener('keydown', event => {
    if (event.key === 'Enter') {event.preventDefault();done.click();return;}
    if (!['ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const old = options.findIndex(button => button.dataset.gem === pending);
    const index = event.key==='Home' ? 0 : event.key==='End' ? options.length-1 : Math.max(0,Math.min(options.length-1,old+(event.key==='ArrowDown'?1:-1)));
    choose(index);list.scrollTo({top:index*row(),behavior:'smooth'});
  });
  function open() {
    refresh();
    const isOther = form.elements.gem.value === 'other';
    allOptions.forEach(button => { button.hidden = isOther === primaryGems.includes(button.dataset.gem); });
    options = allOptions.filter(button=>!button.hidden);
    list.setAttribute('aria-label',isOther ? 'Other gemstone varieties. Scroll to choose.' : 'Gemstone variety. Scroll to choose.');
    pending = isOther ? (select.value||'spinel') : (form.elements.gem.value||'sapphire');
    opening=true;
    if (!modal.open) modal.showModal();
    list.scrollTop=options.findIndex(button=>button.dataset.gem===pending)*row();
    paint();list.focus({preventScroll:true});
    setTimeout(()=>{opening=false;},200);
  }
  form.addEventListener('change', event => {
    if (event.target.name === 'gem' && event.target.value === 'other') open();
    refresh();
  });
  trigger.addEventListener('click', open);
  document.querySelector('.gem-wheel').addEventListener('dblclick',open);
  // Capture runs before the row's own click handler selects it, so a first tap only selects.
  let tappedSelected = false;
  document.querySelector('.gem-wheel').addEventListener('click',event=>{tappedSelected=!!event.target.closest('.wheel-selected');},true);
  document.querySelector('.gem-wheel').addEventListener('click',()=>{if(tappedSelected)open();});
  document.getElementById('close-other-gems').addEventListener('click', () => modal.close());
  allOptions.forEach(button=>button.addEventListener('click',()=>{
    const index=options.indexOf(button);
    if (pending === button.dataset.gem) {done.click();return;}
    choose(index);list.scrollTo({top:index*row(),behavior:'smooth'});
  }));
  done.addEventListener('click',()=>{
    clearTimeout(timer);
    const chosen = pending;
    const primary = primaryGems.includes(chosen);
    const type = primary ? chosen : 'other';
    const radio=form.querySelector(`[name=gem][value="${type}"]`);
    radio.checked=true;
    radio.dispatchEvent(new Event('change',{bubbles:true}));
    if (!primary) {select.value=chosen;select.dispatchEvent(new Event('change',{bubbles:true}));}
    document.querySelector('.gem-wheel').scrollTop=primaryGems.indexOf(type)*44;
    refresh();
    // "Other gem" stays open: the change above swaps the wheel to the other varieties.
    if (chosen !== 'other') modal.close();
  });
  modal.addEventListener('close', () => {
    if (form.elements.gem.value === 'other') trigger.focus({preventScroll:true});
  });
  modal.addEventListener('click', event => {
    const bounds = modal.getBoundingClientRect();
    if (event.target === modal && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) modal.close();
  });
  form.addEventListener('reset', () => setTimeout(() => {modal.close();refresh();},0));
  refresh();
})();
