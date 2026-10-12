'use strict';
(() => {
  const input = document.getElementById('weight');
  const form = document.getElementById('calculator');
  const wheels = [document.getElementById('carat-whole'), document.getElementById('carat-fraction')];
  const values = [0, 0];
  const rowHeight = 44;
  let syncing = false;
  const edits = [];
  const weightHint = document.querySelector('.carat-instruction');
  weightHint.textContent = 'Scroll or tap to edit';
  document.querySelector('.carat-wheels').before(weightHint);
  function paint(index) {
    const wheel = wheels[index];
    wheel.setAttribute('aria-valuenow', values[index]);
    wheel.querySelectorAll('.carat-row').forEach((row, n) => row.classList.toggle('carat-selected', n === values[index]));
  }
  function update(index, value) {
    values[index] = value;
    paint(index);
    const next = `${values[0]}.${String(values[1]).padStart(2, '0')}`;
    if (input.value !== next) {
      input.value = next;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  function finish(index, commit = true, focus = false) {
    const edit = edits[index];
    if (!edit.active) return;
    if (commit && /^\d{1,2}$/.test(edit.input.value.trim())) update(index, Number(edit.input.value.trim()));
    edit.active = false;
    edit.input.hidden = true;
    wheels[index].classList.remove('carat-editing');
    syncing = true;
    wheels[index].scrollTop = values[index] * rowHeight;
    setTimeout(() => { syncing = false; }, 180);
    if (focus) wheels[index].focus({ preventScroll: true });
  }
  function start(index) {
    finish(1 - index);
    const edit = edits[index];
    wheels[index].scrollTop = values[index] * rowHeight;
    edit.active = true;
    wheels[index].classList.add('carat-editing');
    edit.input.value = String(values[index]).padStart(2, '0');
    edit.input.hidden = false;
    edit.input.focus({ preventScroll: true });
    edit.input.select();
  }
  wheels.forEach((wheel, index) => {
    const slot = document.createElement('div');
    slot.className = 'carat-slot';
    wheel.before(slot);
    slot.append(wheel);
    const editor = document.createElement('input');
    editor.className = 'carat-inline-input';
    editor.type = 'text';
    editor.inputMode = 'numeric';
    editor.maxLength = 2;
    editor.autocomplete = 'off';
    editor.hidden = true;
    editor.setAttribute('aria-label', index === 0 ? 'Edit whole carats, 0 to 99' : 'Edit decimal carats, 00 to 99');
    slot.append(editor);
    edits[index] = { input: editor, active: false };
    editor.addEventListener('input', () => { editor.value = editor.value.replace(/\D/g, '').slice(0, 2); });
    editor.addEventListener('blur', () => finish(index));
    editor.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === 'Escape') {
        event.preventDefault();event.stopPropagation();
        finish(index, event.key === 'Enter', true);
      }
    });
    let timer;
    for (let n = 0; n <= 99; n++) {
      const row = document.createElement('div');
      row.className = 'carat-row';row.setAttribute('aria-hidden', 'true');
      row.textContent = String(n).padStart(2, '0');wheel.append(row);
      row.addEventListener('click', () => {
        if (n === values[index]) { start(index); return; }
        update(index, n);wheel.scrollTo({ top: n * rowHeight, behavior: 'smooth' });
      });
    }
    const settle = () => {
      if (syncing || edits[index].active) return;
      update(index, Math.min(99, Math.max(0, Math.round(wheel.scrollTop / rowHeight))));
    };
    wheel.addEventListener('scroll', () => { clearTimeout(timer);timer = setTimeout(settle, 100); }, { passive: true });
    wheel.addEventListener('scrollend', settle);
    wheel.addEventListener('keydown', event => {
      if (event.key === 'Enter') { event.preventDefault();start(index);return; }
      if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 99 : Math.min(99, Math.max(0, values[index] + (event.key === 'ArrowDown' ? 1 : -1)));
      update(index, next);wheel.scrollTo({ top: next * rowHeight, behavior: 'smooth' });
    });
    paint(index);
  });
  function sync() {
    syncing = true;
    edits.forEach((edit, index) => {
      edit.active = false;edit.input.hidden = true;wheels[index].classList.remove('carat-editing');
    });
    const value = Number(input.value) || 0;
    values[0] = Math.min(99, Math.floor(value));
    values[1] = Math.round((value - Math.floor(value)) * 100);
    wheels.forEach((wheel, index) => { wheel.scrollTop = values[index] * rowHeight;paint(index); });
    setTimeout(() => { syncing = false; }, 200);
  }
  form.addEventListener('reset', () => setTimeout(sync, 0));
  document.getElementById('try-example').addEventListener('click', () => setTimeout(sync, 0));
  sync();
})();
