(()=>{'use strict';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-deck]').forEach(deck=>{
 const cards=[...deck.querySelectorAll('[data-card]')],button=deck.querySelector('[data-motion]');let current=0,paused=reduced.matches,hover=false,inView=false;
 function draw(){cards.forEach((card,i)=>{const depth=(i-current+cards.length)%cards.length;card.style.setProperty('--depth',depth);card.style.setProperty('--turn',`${depth===0?-2:(depth%2?-1:1)*(5+depth*1.7)}deg`);card.style.setProperty('--shift',`${depth===0?0:(depth%2?-1:1)*(12+depth*2)}px`);card.style.setProperty('--lift',`${depth*1.8}px`)});button.textContent=paused?'播放动效':'暂停动效';button.setAttribute('aria-pressed',String(paused))}
 button.addEventListener('click',()=>{paused=!paused;draw()});deck.addEventListener('mouseenter',()=>hover=true);deck.addEventListener('mouseleave',()=>hover=false);deck.addEventListener('focusin',()=>hover=true);deck.addEventListener('focusout',()=>hover=false);
 const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting});observer.observe(deck);
 reduced.addEventListener('change',()=>{paused=reduced.matches;draw()});draw();
 setInterval(()=>{if(!paused&&!hover&&inView&&!document.hidden){current=(current+1)%cards.length;draw()}},3200);
});
let hlsPromise;
function loadHls(){if(window.Hls)return Promise.resolve(window.Hls);if(!hlsPromise)hlsPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/assets/vendor/hls.min.js';s.onload=()=>resolve(window.Hls);s.onerror=()=>{hlsPromise=null;reject(new Error('load'))};document.head.append(s)});return hlsPromise}
const video=document.querySelector('video[data-src]');if(!video)return;
const play=document.querySelector('.start-video'),status=document.querySelector('.player-status'),retry=document.querySelector('.retry-video');let hls,started=false,timer;
function error(){status.textContent='视频暂时未能加载，请重试。';retry.hidden=false;clearTimeout(timer)}
async function start(){
 if(started)return;started=true;play.hidden=true;retry.hidden=true;status.textContent='正在加载视频…';timer=setTimeout(()=>{if(video.readyState<2)error()},45000);
 try{
  if(video.dataset.format==='hls'&&!video.canPlayType('application/vnd.apple.mpegurl')){
   const Hls=await loadHls();if(!Hls.isSupported())throw new Error('unsupported');
   hls=new Hls({maxBufferLength:30,maxMaxBufferLength:60});hls.loadSource(video.dataset.src);hls.attachMedia(video);
   hls.on(Hls.Events.MANIFEST_PARSED,()=>video.play().catch(()=>{status.textContent='请点击播放器的播放按钮。'}));hls.on(Hls.Events.ERROR,(_,data)=>{if(data.fatal)error()});
  }else{video.src=video.dataset.src;video.load();await video.play().catch(()=>{status.textContent='请点击播放器的播放按钮。'})}
 }catch{error()}
}
play.addEventListener('click',start);video.addEventListener('play',()=>{if(!started)start()});video.addEventListener('canplay',()=>{status.textContent='';clearTimeout(timer);retry.hidden=true});video.addEventListener('error',error);
retry.addEventListener('click',()=>{if(hls){hls.destroy();hls=null}video.removeAttribute('src');video.load();started=false;start()});window.addEventListener('pagehide',()=>{if(hls)hls.destroy()});
})();
