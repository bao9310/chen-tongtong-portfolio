(()=>{'use strict';
/* 动效增强：滚动渐显 + 图片加载淡入（尊重 prefers-reduced-motion，无 JS 时不影响展示） */
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(reduced.matches)return;
document.documentElement.classList.add('motion');

const REVEAL_SELECTOR='.entry-card,.media-card,.category-card,.image-item,.resume-project,.tool-compact,.skill-card,.project-card,.exp-row,.section-heading,.gallery-intro,.planned-content,.hero-copy,.portrait-slot,.experience-strip,.collection-tail,.inline-workbench,.category-text';

const items=[...document.querySelectorAll(REVEAL_SELECTOR)];
/* 首屏元素立即进入，其余进入视口时渐显 */
function inViewport(el){
  const r=el.getBoundingClientRect();
  return r.top<innerHeight*0.92&&r.bottom>0;
}
items.forEach((el,i)=>{
  el.style.setProperty('--rv-delay',(i%3)*80);
  if(inViewport(el)){el.classList.add('rv-in');return}
  el.classList.add('rv');
});
const io=new IntersectionObserver(entries=>{
  entries.forEach(en=>{if(en.isIntersecting){en.target.classList.remove('rv');en.target.classList.add('rv-in');io.unobserve(en.target)}});
},{rootMargin:'0px 0px -8% 0px',threshold:0.06});
items.forEach(el=>{if(!el.classList.contains('rv-in'))io.observe(el)});

/* 图片加载完成淡入（容器渐显之外的补充） */
const imgs=[...document.querySelectorAll('.video-cover img,.category-cover img,.image-item img')];
imgs.forEach(img=>{
  if(img.complete&&img.naturalWidth>0){img.classList.add('loaded');return}
  img.addEventListener('load',()=>img.classList.add('loaded'),{once:true});
});
})();
