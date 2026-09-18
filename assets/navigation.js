document.documentElement.classList.add('nav-js');
const menuButton=document.querySelector('.menu-toggle');
const siteNav=document.querySelector('#site-nav');
if(menuButton&&siteNav){
 const closeMenu=()=>{menuButton.setAttribute('aria-expanded','false');siteNav.classList.remove('is-open')};
 menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));siteNav.classList.toggle('is-open',open)});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMenu();menuButton.focus()}});
 siteNav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu()});
}
