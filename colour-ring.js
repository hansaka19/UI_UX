'use strict';
(() => {
  const form=document.getElementById('calculator');
  const input=document.getElementById('colour');
  const figure=document.querySelector('.gem-preview');
  const host=document.getElementById('gem-canvas');
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 196 196');svg.setAttribute('aria-hidden','true');
  const slider=document.createElement('div');
  slider.className='colour-ring';slider.tabIndex=0;slider.setAttribute('role','slider');
  slider.setAttribute('aria-label','Colour strength');slider.setAttribute('aria-valuemin','0');slider.setAttribute('aria-valuemax','100');
  slider.setAttribute('aria-describedby','colour-ring-hint');slider.append(svg);figure.append(slider);
  const readout=document.createElement('p');readout.className='colour-ring-readout';figure.after(readout);
  const hint=document.createElement('p');hint.id='colour-ring-hint';hint.className='colour-ring-hint';hint.textContent='Drag the square to match the colour';readout.after(hint);
  const unknown=document.createElement('button');unknown.type='button';unknown.className='colour-unknown';unknown.textContent='I do not know';hint.after(unknown);
  const palettes={ruby:[187,21,59],sapphire:[36,85,213],emerald:[7,130,80],other:[129,102,172]};
  let level=.5, dragging=false;
  const point=t=>{const angle=(225-270*t)*Math.PI/180;return[98+90*Math.cos(angle),98+90*Math.sin(angle)]};
  const colour=t=>{const base=palettes[form.elements.gem.value]||[115,130,130];return `rgb(${base.map(v=>Math.round(t<.5? v+(255-v)*(.82*(1-t*2)):v*(1-.6*(t-.5)*2))).join(',')})`};
  const segments=[];
  for(let i=0;i<72;i++){
    const path=document.createElementNS(ns,'path');const a=point(i/72),b=point((i+1.15)/72);
    path.setAttribute('d',`M${a.join(',')} A90,90 0 0 0 ${b.join(',')}`);path.setAttribute('fill','none');path.setAttribute('stroke-width','5');svg.append(path);segments.push(path);
  }
  const track=document.createElementNS(ns,'path');const a=point(0),b=point(1);
  track.setAttribute('d',`M${a.join(',')} A90,90 0 1 0 ${b.join(',')}`);track.setAttribute('fill','none');track.setAttribute('stroke','transparent');track.setAttribute('stroke-width','24');track.style.pointerEvents='stroke';svg.append(track);
  const handle=document.createElementNS(ns,'g');
  const hit=document.createElementNS(ns,'rect');hit.setAttribute('x','-22');hit.setAttribute('y','-22');hit.setAttribute('width','44');hit.setAttribute('height','44');hit.setAttribute('fill','transparent');hit.style.pointerEvents='all';handle.append(hit);
  const square=document.createElementNS(ns,'rect');square.setAttribute('x','-6');square.setAttribute('y','-6');square.setAttribute('width','12');square.setAttribute('height','12');square.setAttribute('rx','3');square.setAttribute('stroke','#fff');square.setAttribute('stroke-width','2');square.style.filter='drop-shadow(0 1px 2px #56617080)';handle.append(square);svg.append(handle);
  function paint(){
    segments.forEach((path,i)=>path.setAttribute('stroke',colour(i/71)));
    const p=point(level);handle.setAttribute('transform',`translate(${p.join(',')}) rotate(${225-270*level+90})`);square.setAttribute('fill',colour(level));
    const known=input.value!=='unknown';
    const label=known?input.options[input.selectedIndex].textContent:'Not set';
    readout.textContent=`Colour strength · ${label}`;
    unknown.classList.toggle('is-unknown',!known);
    slider.setAttribute('aria-valuenow',String(Math.round(level*100)));slider.setAttribute('aria-valuetext',known?`${label}, ${Math.round(level*100)} percent`:'Unknown; drag to choose');
    host.dataset.colourLevel=String(level);host.dataset.colourKnown=String(known);
    host.dispatchEvent(new Event('colourpreview'));
  }
  function set(value){level=Math.max(0,Math.min(1,value));input.value=level<1/3?'light':level>2/3?'deep':'medium';paint();input.dispatchEvent(new Event('change',{bubbles:true}));}
  function fromPointer(event){const r=svg.getBoundingClientRect();const x=event.clientX-(r.left+r.width/2),y=event.clientY-(r.top+r.height/2);const angle=Math.atan2(y,x)*180/Math.PI;let travel=(225-angle+360)%360;if(travel>270)travel=travel>315?0:270;set(travel/270);}
  slider.addEventListener('pointerdown',event=>{if(event.button!==0)return;dragging=true;slider.setPointerCapture(event.pointerId);slider.focus({preventScroll:true});event.preventDefault();fromPointer(event)});
  slider.addEventListener('pointermove',event=>{if(dragging)fromPointer(event)});
  const end=()=>dragging=false;slider.addEventListener('pointerup',end);slider.addEventListener('pointercancel',end);slider.addEventListener('lostpointercapture',end);
  slider.addEventListener('keydown',event=>{const changes={ArrowRight:.04,ArrowUp:.04,ArrowLeft:-.04,ArrowDown:-.04};if(event.key in changes||['Home','End'].includes(event.key)){event.preventDefault();set(event.key==='Home'?0:event.key==='End'?1:level+changes[event.key])}});
  unknown.addEventListener('click',()=>{input.value='unknown';level=.5;paint();input.dispatchEvent(new Event('change',{bubbles:true}))});
  function sync(){level={light:1/6,medium:.5,deep:5/6}[input.value]??.5;paint()}
  form.addEventListener('change',event=>{if(event.target.name==='gem')paint();else if(event.target===input&& !dragging)paint()});
  form.addEventListener('reset',()=>setTimeout(sync,0));document.getElementById('try-example').addEventListener('click',()=>setTimeout(sync,0));sync();
})();
