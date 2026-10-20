(() => {
const init=()=>{
 const body=document.body;if(!body.classList.contains('is-frontend'))return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.addEventListener('dragstart',e=>{if(e.target.closest('img,picture'))e.preventDefault();});
 const header=document.querySelector('#header');const headerSize=()=>document.documentElement.style.setProperty('--dx-header-bottom',Math.max(70,header?.getBoundingClientRect().bottom||100)+'px');headerSize();if(header)new ResizeObserver(headerSize).observe(header);
 const list=document.querySelector('.dx-menu__list');if(list){const links=[...list.querySelectorAll(':scope>li>a')];const home=links.find(a=>new URL(a.href).pathname==='/');if(home){home.setAttribute('aria-label','Home');home.innerHTML='<svg class="dx-home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 11 12 3l9 8M5 9v12h5v-7h4v7h5V9"/></svg>';}
 const login=links.find(a=>/client login/i.test(a.textContent));if(login){const cta=document.querySelector('.dx-menu__cta');if(cta){cta.href=login.href;cta.querySelector('span').textContent='Client login';}login.parentElement.remove();}
 const photo=links.find(a=>new URL(a.href).pathname==='/photography/'),contact=links.find(a=>new URL(a.href).pathname==='/contact/');if(photo&&contact)photo.parentElement.after(contact.parentElement);}
 // Lock the actual page position while retaining independent menu scrolling.
 let savedY=0,locked=false;const lock=()=>{const open=body.classList.contains('nav-open');if(open&&!locked){savedY=scrollY;locked=true;body.style.position='fixed';body.style.top=-savedY+'px';body.style.width='100%';}else if(!open&&locked){locked=false;body.style.position='';body.style.top='';body.style.width='';window.scrollTo({top:savedY,behavior:'instant'});}};new MutationObserver(lock).observe(body,{attributes:true,attributeFilter:['class']});
 // Reveal individual photographs only as they approach the viewport.
 const photos=[...document.querySelectorAll('#dxb-gallery .dxb-photo-card')];if('IntersectionObserver'in window&&!reduced.matches){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('dx-photo-pending');io.unobserve(e.target);}}),{rootMargin:'0px 0px 60px 0px',threshold:.02});photos.forEach(p=>{p.classList.add('dx-photo-pending');io.observe(p);});}
 const photoHero=document.querySelector('.dx-photo-hero');if(photoHero&&photos.length){
 const sources=photos.slice(0,8).map(p=>p.querySelector('img')).filter(Boolean);let index=0,active=0,paused=reduced.matches;
 const layers=[0,1].map((_,i)=>{const img=sources[0].cloneNode();img.className='dx-page-hero-art'+(i?' dx-slide-hidden':'');img.alt='';img.loading='eager';photoHero.prepend(img);return img;});
 const toggle=document.createElement('button');toggle.type='button';toggle.className='dx-photo-pause';const label=()=>{toggle.textContent=paused?'Play slideshow':'Pause slideshow';};label();toggle.addEventListener('click',()=>{paused=!paused;label();});photoHero.append(toggle);
 setInterval(()=>{if(paused||document.hidden||photoHero.getBoundingClientRect().bottom<0)return;index=(index+1)%sources.length;const next=layers[1-active],source=sources[index];next.src=source.currentSrc||source.src;next.removeAttribute('srcset');next.decode().then(()=>{next.classList.remove('dx-slide-hidden');layers[active].classList.add('dx-slide-hidden');active=1-active;}).catch(()=>{});},5500);
 reduced.addEventListener('change',()=>{paused=reduced.matches;label();});
 }
 const reel=document.querySelector('.dx-project-reel'),track=reel?.querySelector('.dx-project-track');if(reel&&track){let distance=0;const size=()=>{distance=Math.max(0,track.scrollWidth-innerWidth+innerWidth*.12);reel.style.height=reduced.matches?'auto':innerHeight+distance+'px';update();};const update=()=>{if(reduced.matches)return;const progress=Math.min(distance,Math.max(0,-reel.getBoundingClientRect().top));track.style.transform=`translate3d(${-progress}px,0,0)`;};window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',size);reduced.addEventListener('change',size);new ResizeObserver(size).observe(track);size();track.addEventListener('focusin',e=>{const card=e.target.closest('.dx-project-poster');if(!card||reduced.matches)return;window.scrollTo({top:scrollY+reel.getBoundingClientRect().top+Math.min(distance,card.offsetLeft-track.offsetLeft),behavior:'smooth'});});}
 // Keep earlier project chapters readable in normal document flow.
 if(body.classList.contains('single-project')){document.querySelectorAll('.story-section').forEach(s=>{s.classList.add('dx-editorial-chapter');});document.querySelectorAll('.story-section img').forEach(img=>{img.loading='lazy';img.decoding='async';});}
 // Bounded, frame-scheduled background movement; reduced-motion users see a still image.
 const parallax=[];
 const closing=document.querySelector('body.home .start-something');
 if(closing){const img=closing.querySelector('img.wp-block-cover__image-background');if(img){closing.classList.add('dx-parallax-section');img.classList.add('dx-parallax-art');parallax.push([closing,img]);}}
 document.querySelectorAll('.dx-photo-promo').forEach(section=>{const img=section.querySelector('.dx-parallax-art');if(img){section.classList.add('dx-parallax-section');parallax.push([section,img]);}});
 let motionFrame=0;
 const moveBackgrounds=()=>{motionFrame=0;parallax.forEach(([section,img])=>{const rect=section.getBoundingClientRect();if(rect.bottom<0||rect.top>innerHeight)return;img.style.setProperty('--dx-parallax-y',reduced.matches?'0px':Math.max(-45,Math.min(45,(innerHeight/2-rect.top-rect.height/2)*.09))+'px');});};
 const scheduleMotion=()=>{if(!motionFrame)motionFrame=requestAnimationFrame(moveBackgrounds);};
 if(parallax.length){addEventListener('scroll',scheduleMotion,{passive:true});addEventListener('resize',scheduleMotion);reduced.addEventListener('change',scheduleMotion);scheduleMotion();}
 const enquiry=document.querySelector('.enquiry-form');if(enquiry){const syncPhotoBudget=()=>{const photo=enquiry.querySelector('[name=service]:checked')?.value==='photography',budget=enquiry.querySelector('[name=budget]');if(budget){if(photo)budget.value='£40 photography';else if(budget.value==='£40 photography')budget.value='';}};enquiry.addEventListener('change',e=>{if(e.target.name==='service')syncPhotoBudget();});syncPhotoBudget();}

 const fitnessTitle=document.querySelector('.dxf-hero h1');if(fitnessTitle&&!fitnessTitle.querySelector('.dx-gold'))fitnessTitle.innerHTML=fitnessTitle.innerHTML.replace(/Raise the bar\./i,'<span class="dx-gold">Raise the bar.</span>');
 const cover=body.classList.contains('home')?document.querySelector('.hero-background'):null;if(cover){const glow=document.createElement('div');glow.className='dx-home-glow';glow.setAttribute('aria-hidden','true');cover.prepend(glow);}
 // Carry the user's own saved estimate into registration without URL personal data.
 if(body.classList.contains('page-template-page-signup')){try{const h=JSON.parse(sessionStorage.getItem('dxndre-calculator-handoff')||'null');if(h&&new URLSearchParams(location.search).has('from_calculator')){const form=document.querySelector('.auth-signup form');for(const [name,value]of Object.entries({company:h.company,projectref:h.reference})){const input=form?.elements.namedItem(name);if(input&&value)input.value=value;}if(form){const note=document.createElement('p');note.className='dx-account-handoff';note.textContent='Your project details are ready'+(h.reference?' · '+h.reference:'')+'. Choose your account details below.';form.prepend(note);}}}catch{}}
 document.querySelectorAll('.auth form input[placeholder]').forEach(input=>{if(!input.hasAttribute('aria-label'))input.setAttribute('aria-label',input.placeholder);});
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

document.addEventListener('DOMContentLoaded', () => {
  // Keep permanent accessible names when the visible prompt moves into the field.
  document.querySelectorAll('body.page-id-22 .fluentform .ff-el-group').forEach(group => {
    const field=group.querySelector('input:not([type=checkbox]):not([type=radio]):not([type=hidden]),select,textarea');
    const label=group.querySelector('.ff-el-input--label');
    if(!field||!label)return;
    const text=label.textContent.trim().replace(/\s+/g,' ')+(label.classList.contains('ff-el-is-required')?' *':'');
    if(field.tagName==='SELECT') { const option=field.querySelector('option[value=""]');if(option)option.textContent=text; }
    else field.placeholder=field.tagName==='TEXTAREA'?text+' — Tell me about your project, timeline and goals.':text;
    label.classList.add('dx-placeholder-label');
  });
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const word=document.querySelector('.dxf-hero .dx-gold');
  if(word){const watch=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){word.classList.add('dx-raise');watch.disconnect();}},{threshold:.4});watch.observe(word);}
  const slides=[...document.querySelectorAll('.dx-service-slides img')], toggle=document.querySelector('.dx-slides-toggle');
  if(slides.length&&toggle){let index=-1,paused=reduced.matches;toggle.textContent=paused?'Play slideshow':'Pause slideshow';toggle.setAttribute('aria-pressed',String(paused));toggle.addEventListener('click',()=>{paused=!paused;toggle.textContent=paused?'Play slideshow':'Pause slideshow';toggle.setAttribute('aria-pressed',String(paused));});setInterval(()=>{if(paused||document.hidden)return;const next=(index+1)%(slides.length+1);if(next<slides.length&&!slides[next].complete)return;slides.forEach((img,i)=>img.classList.toggle('is-visible',i===next));index=next;},5500);reduced.addEventListener('change',e=>{paused=e.matches;toggle.textContent=paused?'Play slideshow':'Pause slideshow';toggle.setAttribute('aria-pressed',String(paused));});}
  const lazy=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const video=entry.target;video.src=video.dataset.videoSrc;video.load();lazy.unobserve(video);}),{rootMargin:'250px'});
  document.querySelectorAll('video[data-video-src]').forEach(video=>{video.addEventListener('loadeddata',()=>video.parentElement.classList.add('is-ready'));video.addEventListener('error',()=>{const text=video.parentElement.querySelector('.dxf-media-loading');if(text)text.textContent='Video unavailable. Please try again later.';});lazy.observe(video);});
  const dialog=document.querySelector('.dxf-media-dialog');
  if(dialog){document.querySelectorAll('[data-fitness-image]').forEach(button=>button.addEventListener('click',()=>{const img=dialog.querySelector('img');img.src=button.dataset.fitnessImage;img.alt=button.querySelector('img').alt;dialog.showModal();}));dialog.querySelector('button').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});}
});

document.addEventListener('DOMContentLoaded',()=>{
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const promo=document.querySelector('.dx-photo-promo'), config=document.getElementById('dx-promo-images');
 if(promo&&config){
  const urls=JSON.parse(config.textContent).filter(Boolean),original=promo.querySelector('.dx-parallax-art');
  if(urls.length>1&&original){
   const layers=[0,1].map(()=>{const img=document.createElement('img');img.className='dx-promo-slide';img.alt='';img.setAttribute('aria-hidden','true');promo.prepend(img);return img;});
   let queue=[],last=original.src,active=0,paused=motion.matches,busy=false;
   const next=()=>{if(!queue.length){queue=urls.slice();for(let i=queue.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[queue[i],queue[j]]=[queue[j],queue[i]];}if(queue[queue.length-1]===last)queue.unshift(queue.pop());}return queue.pop();};
   const change=async()=>{if(paused||document.hidden||busy)return;busy=true;const url=next(),img=layers[active];img.src=url;try{await img.decode();if(paused)return;img.classList.add('is-active');layers[1-active].classList.remove('is-active');original.style.opacity='0';last=url;active=1-active;}catch(e){}finally{busy=false;}};
   const button=document.createElement('button');button.type='button';button.className='dx-promo-pause';const label=()=>{button.textContent=paused?'Play slideshow':'Pause slideshow';button.setAttribute('aria-pressed',String(paused));};label();button.addEventListener('click',()=>{paused=!paused;label();if(!paused)change();});promo.append(button);motion.addEventListener('change',e=>{paused=e.matches;label();});setInterval(change,5500);change();
  }
 }
 const selector='.dxb-gallery img,.dxb-gallery video,.dxf-media-grid img,.dxf-media-grid video,.wp-block-gallery img,.wp-block-gallery video,.dxf-media-dialog img,#dxb-lightbox img,#dxb-lightbox video';
 const seen=new WeakSet(),visible=new WeakSet();
 const reveal=media=>{const ready=media.tagName==='VIDEO'?media.readyState>=2:media.complete&&media.naturalWidth>0;if(!visible.has(media)||!ready||!media.classList.contains('dx-colour-pending'))return;media.classList.remove('dx-colour-pending');media.classList.add('dx-colour-ready');if(!motion.matches){media.classList.add('dx-colour-reveal');media.addEventListener('animationend',()=>media.classList.remove('dx-colour-reveal'),{once:true});}};
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){visible.add(e.target);reveal(e.target);}else visible.delete(e.target);}),{threshold:.08});
 const attach=media=>{if(seen.has(media))return;seen.add(media);media.classList.add('dx-colour-pending');observer.observe(media);media.addEventListener(media.tagName==='VIDEO'?'loadeddata':'load',()=>reveal(media));};
 document.querySelectorAll(selector).forEach(attach);
 new MutationObserver(records=>records.forEach(record=>{if(record.type==='attributes'&&record.target.matches(selector)){const m=record.target;m.classList.remove('dx-colour-reveal','dx-colour-ready');m.classList.add('dx-colour-pending');reveal(m);}record.addedNodes.forEach(node=>{if(node.nodeType!==1)return;if(node.matches(selector))attach(node);node.querySelectorAll(selector).forEach(attach);});})).observe(document.querySelector('main')||document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset']});
});

// One-time entrance for page sections, including dynamically inserted route sections.
document.addEventListener('DOMContentLoaded',()=>{
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 if(motion.matches||!('IntersectionObserver' in window))return;
 const seen=new WeakSet();
 const show=section=>{section.classList.remove('dx-section-pending');section.classList.add('dx-section-enter');section.addEventListener('transitionend',()=>section.classList.remove('dx-section-enter'),{once:true});};
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){show(entry.target);observer.unobserve(entry.target);}}),{threshold:0,rootMargin:'0px 0px -35px 0px'});
 const register=section=>{if(seen.has(section))return;seen.add(section);if(section.getBoundingClientRect().top<innerHeight)return;section.classList.add('dx-section-pending');observer.observe(section);};
 document.querySelectorAll('main section').forEach(register);
 new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType!==1)return;if(node.matches('section'))register(node);node.querySelectorAll('section').forEach(register);}))).observe(document.querySelector('main')||document.body,{childList:true,subtree:true});
 document.addEventListener('focusin',event=>{const section=event.target.closest('.dx-section-pending');if(section){observer.unobserve(section);show(section);}});
 motion.addEventListener('change',event=>{if(event.matches){observer.disconnect();document.querySelectorAll('.dx-section-pending,.dx-section-enter').forEach(s=>s.classList.remove('dx-section-pending','dx-section-enter'));}});
});

// Shared CARTO dark location map for both photo galleries.
window.dxRenderPhotoMap = (()=>{
 let previous=null;
 return (container,gps,photo={})=>{
  if(previous){previous.remove();previous=null;}
  const lat=Number(gps.lat),lon=Number(gps.lon);if(!Number.isFinite(lat)||!Number.isFinite(lon))return;
  if(window.L){
   const canvas=document.createElement('div');canvas.className='dx-photo-carto';canvas.setAttribute('aria-label','Photograph location map');container.append(canvas);
   const map=window.L.map(canvas,{scrollWheelZoom:false}).setView([lat,lon],15);previous=map;
   window.L.tileLayer('https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_49v4_1_6f4e11cc72c4a39104c6f6c9',{maxZoom:20,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'}).addTo(map);
   window.L.circleMarker([lat,lon],{radius:7,color:'#f5d78e',weight:2,fillColor:'#d7ad57',fillOpacity:1}).addTo(map);
   requestAnimationFrame(()=>map.invalidateSize());
  }
  const link=document.createElement('a');link.href='https://www.openstreetmap.org/?mlat='+lat+'&mlon='+lon+'#map=16/'+lat+'/'+lon;link.target='_blank';link.rel='noopener';link.textContent='View photo location ↗';container.append(link);
  if(photo.location){const label=document.createElement('p');label.className='dx-photo-location';label.textContent='📍 '+photo.location;container.append(label);}

 };
})();

 document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dx-model-carousel').forEach(carousel => {
        const slides = [...carousel.querySelectorAll('[data-model-slide]')];
        let index = 0, moving = false;
        const reduced = matchMedia('(prefers-reduced-motion: reduce)');
        const show = async direction => {
            if (moving || slides.length < 2) return;
            const previous = slides[index];
            index = (index + direction + slides.length) % slides.length;
            const next = slides[index];
            next.hidden = false;
            if (!reduced.matches) {
                moving = true;
                previous.inert = true;
                const imageOptions={duration:1050,easing:'cubic-bezier(.22,1,.36,1)'};
                const oldImage=previous.querySelector('.dx-model-image'),newImage=next.querySelector('.dx-model-image');
                const animations=[];
                if(oldImage)animations.push(oldImage.animate([{transform:'translateX(0) scale(1.04)',opacity:1},{transform:`translateX(${-direction*18}%) scale(1.04)`,opacity:0}],imageOptions));
                if(newImage)animations.push(newImage.animate([{transform:`translateX(${direction*30}%) scale(1.08)`,opacity:0},{transform:'translateX(0) scale(1)',opacity:1}],imageOptions));
                for(const selector of ['.dx-model-copy','.dx-model-specs > .dxb-eyebrow','.dx-model-specs > dl','.dx-model-specs > a']){
                    const oldPart=previous.querySelector(selector),newPart=next.querySelector(selector);
                    if(oldPart)animations.push(oldPart.animate([{opacity:1},{opacity:0}],{duration:220,fill:'forwards'}));
                    if(newPart)animations.push(newPart.animate([{opacity:0},{opacity:1}],{duration:500,delay:180,fill:'both',easing:'ease-out'}));
                }
                await Promise.allSettled(animations.map(a=>a.finished));
                animations.forEach(a=>a.cancel());
                previous.inert = false;
                moving = false;
            }
            previous.hidden = true;
            carousel.querySelector('[data-model-count]').textContent = `${index + 1} / ${slides.length}`;
        };
        carousel.querySelector('[data-model-prev]')?.addEventListener('click', () => show(-1));
        carousel.querySelector('[data-model-next]')?.addEventListener('click', () => show(1));
    });
 });

document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('.is-premium-league').forEach(archive=>{
  const label=archive.querySelector('[data-gyms-state-title]');if(!label)return;
  const picker=document.createElement('details');picker.className='league-chain-picker';
  const summary=document.createElement('summary');summary.setAttribute('aria-label','Choose gym chain');label.before(picker);summary.append(label);picker.append(summary);
  const options=document.createElement('div');options.className='league-chain-options';picker.append(options);
  archive.querySelectorAll('.gym-filter-buttons [data-chain]').forEach(original=>{const button=document.createElement('button');button.type='button';button.textContent=original.textContent;button.addEventListener('click',()=>{original.click();picker.open=false;summary.focus();});options.append(button);});
  document.addEventListener('click',e=>{if(!picker.contains(e.target))picker.open=false;});picker.addEventListener('keydown',e=>{if(e.key==='Escape'){picker.open=false;summary.focus();}});
 });
});

// Decode before swapping, then soften the transition without showing a blank frame.
window.dxSetPhoto=async (image,photo)=>{
 const token=String((Number(image.dataset.swapToken)||0)+1);image.dataset.swapToken=token;
 const next=new Image();next.src=photo.full;
 try{await next.decode();}catch{}
 if(image.dataset.swapToken!==token)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduced&&image.src){try{await image.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'}).finished;}catch{}}
 if(image.dataset.swapToken!==token)return;
 image.getAnimations().forEach(a=>a.cancel());image.src=photo.full;image.alt=photo.alt||photo.title;
 if(!reduced)image.animate([{opacity:0,transform:'translateX(12px)'},{opacity:1,transform:'translateX(0)'}],{duration:350,easing:'ease-out'});
};

document.addEventListener('DOMContentLoaded',()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const images=[...document.querySelectorAll('.story-hero>.dx-project-hero-background,.gym-review-hero__image')];
 if(!images.length)return;
 let frame=0;
 const paint=()=>{frame=0;images.forEach(image=>{const hero=image.closest('.story-hero,.gym-review-hero');if(!hero)return;const box=hero.getBoundingClientRect();if(box.bottom<0||box.top>innerHeight)return;image.style.setProperty('--dx-hero-shift',reduced.matches?'0px':Math.max(-65,Math.min(65,-box.top*.12))+'px');});};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint);};addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);paint();
});
