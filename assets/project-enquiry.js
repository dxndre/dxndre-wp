(() => {
 const form = document.querySelector('.enquiry-form');
 if (!form) return;
 const steps = [...form.querySelectorAll('[data-step]')], progress = [...form.querySelectorAll('.enquiry-progress li')], error = form.querySelector('.enquiry-error'), next = form.querySelector('[data-next]'), back = form.querySelector('[data-back]'), submit = form.querySelector('[type="submit"]');
 let step = 0, sending = false;
 const labels = { 'design-build': 'What would you like to create?', wordpress: 'What do you need your WordPress website to do?', 'custom-web': 'What would you like your website or application to do?', fixes: 'What’s not working, or what would you like improved?', support: 'What kind of ongoing help do you need?', unsure: 'Tell me about your idea or challenge.' };
 const storageKey = 'dxndre-project-enquiry';
 const save = () => { try { sessionStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(new FormData(form)))); } catch (_) {} };
 const review = () => {
  const data = new FormData(form), selected = form.querySelector('[name="service"]:checked');
  form.querySelector('[data-brief-label]').textContent = labels[data.get('service')] || labels['design-build'];
  const target = form.querySelector('[data-review]'); target.replaceChildren();
  for (const [label, value] of [['Service', selected?.parentElement.querySelector('strong').textContent], ['Project', data.get('brief')], ['Website', data.get('website')], ['Budget', data.get('budget')], ['Timing', data.get('timing')]]) {
   if (!value) continue;
   const row = document.createElement('p'), title = document.createElement('strong'), text = document.createElement('span'); title.textContent = label; text.textContent = value; row.append(title, text); target.append(row);
  }
 };
 const show = (number, focus = true) => {
  step = number; error.hidden = true;
  steps.forEach((el, index) => { el.hidden = index !== step; });
  progress.forEach((el,index) => { el.removeAttribute('aria-current'); if(index === step) el.setAttribute('aria-current','step'); el.classList.toggle('is-complete',index < step); });
  back.hidden = step === 0; next.hidden = step === 2; submit.hidden = step !== 2; review();
  if (focus) { const legend = steps[step].querySelector('legend'); legend.tabIndex = -1; legend.focus(); }
 };
 const validate = (number) => {
  const invalid = [...steps[number].querySelectorAll('input,select,textarea')].find(el => !el.checkValidity());
  if (!invalid) return true;
  error.textContent = number === 0 ? 'Choose a service to continue.' : 'Please complete the required fields and check their format.'; error.hidden = false; invalid.focus(); invalid.reportValidity(); return false;
 };
 try { const saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}'); for(const [key,value] of Object.entries(saved)){const field=form.elements.namedItem(key);if(!field || key==='company_url')continue;if(key==='service'){[...form.querySelectorAll('[name="service"]')].forEach(el=>el.checked=el.value===value);}else field.value=value;} } catch (_) {}
 if(new URLSearchParams(location.search).get('from_calculator') === '1') {
  try {
   const quote = JSON.parse(sessionStorage.getItem('dxndre-calculator-handoff') || 'null');
   if(quote && Number.isFinite(quote.total) && quote.total >= 0 && Array.isArray(quote.summary)) {
    const mapping = {design:'design-build',landing_page:'custom-web',development:'custom-web',wp_development:'wordpress',comprehensive:'design-build',retainer:'support',one_off:'fixes'};
    [...form.querySelectorAll('[name="service"]')].forEach(el => el.checked = el.value === (mapping[quote.service] || 'unsure'));
    if(!form.elements.brief.value) form.elements.brief.value = 'Calculator project outline:\n' + quote.summary.join('\n') + (quote.reference ? '\nEstimate reference: ' + quote.reference : '') + '\n\nIndicative estimate: ' + new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(quote.total) + (quote.monthly ? ' per month' : '') + ' (subject to confirming the brief).';
    if(!form.elements.name.value) form.elements.name.value = quote.name || '';
    if(!form.elements.company.value) form.elements.company.value = quote.company || '';
    if(!form.elements.budget.value) form.elements.budget.value = quote.total < 1000 ? 'Under £1,000' : quote.total < 3000 ? '£1,000–£3,000' : quote.total < 5000 ? '£3,000–£5,000' : quote.total < 10000 ? '£5,000–£10,000' : '£10,000+';
    save();
   }
  } catch (_) {}
 }
 const incoming = new URLSearchParams(location.search).get('enquiry_service');
 if(incoming && Object.hasOwn(labels,incoming)) [...form.querySelectorAll('[name="service"]')].forEach(el=>el.checked=el.value===incoming);
 form.addEventListener('input',save); form.addEventListener('change',()=>{save();review();});
 next.addEventListener('click',()=>{if(validate(step))show(step+1);}); back.addEventListener('click',()=>show(step-1));
 form.querySelectorAll('[data-edit]').forEach(button=>button.addEventListener('click',()=>show(Number(button.dataset.edit))));
 form.addEventListener('submit',async event=>{
  event.preventDefault(); if(sending)return;
  if(step < 2){if(validate(step))show(step+1);return;}
  for(let n=0;n<3;n++){if(!validate(n)){show(n,false);validate(n);return;}}
  sending=true;submit.disabled=true;submit.textContent='Sending…';form.querySelector('.enquiry-status').textContent='Sending your enquiry…';error.hidden=true;
  const body=new FormData(form);body.append('action','dx_project_enquiry');body.append('nonce',DX_ENQUIRY.nonce);
  try{const response=await fetch(DX_ENQUIRY.url,{method:'POST',body,credentials:'same-origin'});const result=await response.json();if(!response.ok||!result.success)throw new Error(result.data?.message||'Please try again.');form.hidden=true;const success=document.querySelector('.enquiry-success');success.hidden=false;success.focus();try{sessionStorage.removeItem(storageKey);}catch(_) {}}
  catch(err){error.textContent=err.message==='Failed to fetch'?'Connection interrupted. Your answers are preserved; please try again.':err.message;error.hidden=false;error.tabIndex=-1;error.focus();}
  finally{sending=false;submit.disabled=false;submit.textContent='Send project enquiry ↗';form.querySelector('.enquiry-status').textContent='';}
 });
 show(0,false);
})();
