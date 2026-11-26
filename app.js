const catalog = [
  {id:'crown',name:'Amethyst Sovereign',category:'Headwear',type:'Crown',rarity:'Legendary',tone:'#eec57b',bg:'#62417b',blurb:'Faceted amethyst spires rise from a dark silver band, with a diamond-cut crystal at the front.'},
  {id:'horns',name:'Crimson Rift Horns',category:'Headwear',type:'Horns',rarity:'Epic',tone:'#d2a0ff',bg:'#693140',blurb:'Curving obsidian horns catch the light along sharp crimson edges.'},
  {id:'headphones',name:'Acid Audio',category:'Headwear',type:'Headphones',rarity:'Rare',tone:'#8bc9fb',bg:'#3d5130',blurb:'Acid-green cushions and a faceted earcup give this chunky headset its signature silhouette.'},
  {id:'blade',name:'Glacier Edge',category:'Gear',type:'Blade',rarity:'Legendary',tone:'#eec57b',bg:'#285667',blurb:'A translucent ice-blue blade meets a sculpted silver guard and a crystal pommel.'},
  {id:'glasses',name:'Starlight Visor',category:'Headwear',type:'Eyewear',rarity:'Rare',tone:'#8bc9fb',bg:'#603954',blurb:'A magenta wraparound lens meets chrome star tips in this glossy avatar accessory.'},
  {id:'dragon',name:'Violet Wyrmling',category:'Companions',type:'Shoulder pet',rarity:'Epic',tone:'#d2a0ff',bg:'#503663',blurb:'A tiny violet dragon with layered scales, bright eyes and folded crystal wings.'}
];
const icon = name => '<svg aria-hidden="true"><use href="#'+name+'"></use></svg>';
const items = document.querySelector('#items');
const filters = document.querySelector('#filters');
const modal = document.querySelector('#modal');
const body = document.querySelector('#modalBody');
const config = window.duplicateConfig || {};
function showCatalog(category) {
  const shown = catalog.filter(item => category === 'All items' || item.category === category);
  for (const button of filters.children) button.setAttribute('aria-pressed', String(button.dataset.category === category));
  document.querySelector('#count').textContent = shown.length + (shown.length === 1 ? ' item' : ' items');
  items.innerHTML = shown.map(item => `<button class="item" data-id="${item.id}" aria-label="View ${item.name}" style="--tone:${item.tone};--bg:${item.bg}"><span class="art"><span class="rarity">${item.rarity}</span><img src="assets/${item.id}.webp" alt="" loading="lazy"></span><span class="item-info"><span><small>${item.type}</small><b>${item.name}</b></span><span class="viewicon">${icon('eye')}</span></span></button>`).join('');
}
filters.innerHTML = ['All items','Headwear','Gear','Companions'].map((name,i) => `<button data-category="${name}">${i===0?icon('layers'):''}${name}</button>`).join('');
filters.addEventListener('click', e => {const b=e.target.closest('[data-category]'); if(b) showCatalog(b.dataset.category)});
showCatalog('All items');
let opener;
function show(content) {
  if(!modal.open) opener=document.activeElement;
  body.innerHTML=content;
  if(!modal.open) modal.showModal();
  document.querySelector('#closeModal').focus();
}
function officialGroup(value) {
  try {
    const u=new URL(value);
    if(u.protocol==='https:' && ['www.roblox.com','roblox.com'].includes(u.hostname) && !u.port && !u.username && !u.password && /^\/(?:communities|groups)\/[1-9]\d*(?:\/[\w-]*)?\/?$/.test(u.pathname)) return u.origin+u.pathname;
  } catch {}
  return '';
}
function localVerification(value) {
  if (!value) return '';
  try {
    const u=new URL(value,location.href);
    if(u.origin===location.origin && u.pathname!==location.pathname && u.pathname!=='/' && u.pathname!=='/index.html') return u.href;
  } catch {}
  return '';
}
function verify() {
  show(`<div class="modal-icon">${icon('shield')}</div><p class="kicker">COMMUNITY VERIFICATION</p><h2 id="modal-title">Verify your account</h2><p>Join the Roblox community to verify your membership.</p><section id="verification"></section>`);
  const area=document.querySelector('#verification');
  const group=officialGroup(config.groupUrl);
  const page=localVerification(config.verificationPage);
  if (group) {
    const line=document.createElement('p');
    const a=document.createElement('a');
    a.className='group-link'; a.href=group; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent=group;
    line.append('Community on Roblox',document.createElement('br'),a);area.append(line);
  }
  if(page){
    const frame=document.createElement('iframe');
    frame.title='Store membership verification'; frame.src=page; frame.referrerPolicy='same-origin'; area.append(frame);
  } else {
    const status=document.createElement('p');status.className='group-status';status.textContent='Preview · Membership verification is not connected yet.';area.append(status);
  }
}
function how(){
  show(`<div class="modal-icon">${icon('gift')}</div><p class="kicker">FIRST PURCHASE OFFER</p><h2 id="modal-title">How it works</h2><ol><li>Explore the avatar collection and preview an item.</li><li>Open account verification and join the linked Roblox community.</li><li>The planned first-purchase reward is 100% of the item price back in Robux.</li></ol><p class="group-status">Store preview · Purchases and reward payouts are currently unavailable.</p><button class="btn primary" data-verify>${icon('shield')}Verify account</button>`);
}
items.addEventListener('click', e => {
  const b=e.target.closest('[data-id]'); if(!b)return;
  const item=catalog.find(p=>p.id===b.dataset.id);
  show(`<p class="kicker">COLLECTION PREVIEW</p><div class="detail-art" style="--bg:${item.bg}"><img src="assets/${item.id}.webp" alt="${item.name}"></div><p class="kicker">${item.rarity.toUpperCase()} · ${item.type.toUpperCase()}</p><h2 id="modal-title">${item.name}</h2><p>${item.blurb}</p>`);
});
document.addEventListener('click',e=>{
  if(e.target.closest('[data-verify]'))verify();
  else if(e.target.closest('[data-how]'))how();
});
document.querySelector('#closeModal').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()}});
modal.addEventListener('close',()=>{body.replaceChildren();opener?.focus()});
function navState(){for(const a of document.querySelectorAll('nav a')){if(a.hash===(location.hash||'#home'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}}
window.addEventListener('hashchange',navState);navState();
