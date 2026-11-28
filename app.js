'use strict';
const $=id=>document.getElementById(id), el=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n};

/* ===== GESTIONE COOKIE NORMATIVA ITALIANA & UE/USA ===== */
const CONSENT_KEY = 'osinthub_cookie_consent_v1';
const ACCESS_KEY = 'osinthub_access_mode_v1';

function getConsent(){
  try{
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch{return null}
}

function saveConsent(prefs){
  const record = {
    necessary: true,
    functional: !!prefs.functional,
    networkDiag: !!prefs.networkDiag,
    timestamp: new Date().toISOString(),
    version: '1.0-IT-EU-US'
  };
  try{
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    document.cookie = 'osinthub_consent=' + encodeURIComponent(JSON.stringify({f:record.functional?1:0,n:record.networkDiag?1:0})) + '; max-age=' + (180*86400) + '; path=/; SameSite=Lax; Secure';
  }catch{}
  window.dispatchEvent(new CustomEvent('osint:consent-updated', {detail: record}));
  return record;
}

function initCookieBanner(){
  const banner = $('cookieBanner');
  if(!banner) return;
  const prefsPanel = $('cookiePrefsPanel');
  const btnCustomize = $('cookieCustomize');
  const btnSave = $('cookieSavePrefs');
  const optFunc = $('optFunctional');
  const optNet = $('optNetworkDiag');

  const existing = getConsent();
  if(!existing){
    banner.hidden = false;
  } else {
    if(optFunc) optFunc.checked = !!existing.functional;
    if(optNet) optNet.checked = !!existing.networkDiag;
  }

  const closeBanner = () => { banner.hidden = true; };

  $('cookieAcceptAll')?.addEventListener('click', ()=>{
    saveConsent({functional:true, networkDiag:true});
    closeBanner();
  });

  $('cookieReject')?.addEventListener('click', ()=>{
    saveConsent({functional:false, networkDiag:false});
    closeBanner();
  });

  $('cookieCloseX')?.addEventListener('click', ()=>{
    saveConsent({functional:false, networkDiag:false});
    closeBanner();
  });

  btnCustomize?.addEventListener('click', ()=>{
    const isHidden = prefsPanel.hidden;
    prefsPanel.hidden = !isHidden;
    btnSave.hidden = !isHidden;
    btnCustomize.textContent = isHidden ? 'Nascondi opzioni' : 'Personalizza';
  });

  btnSave?.addEventListener('click', ()=>{
    saveConsent({
      functional: optFunc ? optFunc.checked : false,
      networkDiag: optNet ? optNet.checked : false
    });
    closeBanner();
  });

  $('openCookiePrefs')?.addEventListener('click', ()=>{
    const cur = getConsent();
    if(cur){
      if(optFunc) optFunc.checked = !!cur.functional;
      if(optNet) optNet.checked = !!cur.networkDiag;
    }
    prefsPanel.hidden = false;
    btnSave.hidden = false;
    if(btnCustomize) btnCustomize.textContent = 'Nascondi opzioni';
    banner.hidden = false;
  });
}

/* ===== SINCRONIZZAZIONE STATO UTENTE / ADMIN ===== */
function syncUserNav(){
  const nav = $('userNav');
  if(!nav) return;
  try{
    const user = JSON.parse(localStorage.getItem('osinthub_user') || 'null');
    if(user && !user.guest){
      nav.textContent = (user.role === 'admin' ? '🛡️ Admin: ' : '👤 ') + (user.name || user.email || 'Account');
      nav.href = user.role === 'admin' ? 'admin.html' : 'login.html';
    } else if(user && user.guest){
      nav.textContent = 'Ospite · Accedi';
      nav.href = 'login.html';
    } else {
      nav.textContent = 'Accedi / Ospite';
      nav.href = 'login.html';
    }
  }catch{
    nav.textContent = 'Accedi / Ospite';
  }
}

/* ===== TERMINALE HACKER FOSFORO VERDE + MATRIX RAIN + TYPEWRITER ===== */
function startMatrixRain(canvas){
  if(!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const chars = '0123456789ABCDEF01010110#$%@*+=-<>[]{}';
  const fontSize = 14;
  let columns = Math.floor(w / fontSize);
  let drops = Array(columns).fill(1);

  const onResize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    columns = Math.floor(w / fontSize);
    drops = Array(columns).fill(1);
  };
  window.addEventListener('resize', onResize);

  const interval = setInterval(() => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px ui-monospace, monospace';
    for(let i = 0; i < drops.length; i++){
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if(drops[i] * fontSize > h && Math.random() > 0.975){
        drops[i] = 0;
      }
      drops[i]++;
    }
  }, 45);

  return () => {
    clearInterval(interval);
    window.removeEventListener('resize', onResize);
  };
}

function runBootSequence(){
  const overlay = $('hackerTerminal');
  const out = $('terminalOutput');
  const welcomeModal = $('welcome');
  const canvas = $('matrixCanvas');
  if(!overlay || !out) return;

  overlay.style.display = 'grid';
  overlay.hidden = false;
  out.textContent = '';

  const stopMatrix = startMatrixRain(canvas);

  const urlParams = new URLSearchParams(window.location.search);
  const justLoggedIn = urlParams.get('logged') === '1';

  const lines = justLoggedIn ? [
    'root@osinthub-ita:~# verify --session-token --tls1.3',
    '[OK] Handshake crittografico TLS 1.3 stabilito (AES-256-GCM)',
    '[OK] Nodo Edge Cloudflare attivo · Protezione anti-leak DNS',
    '[OK] Modulo telemetria IP / ASN / VPN sincronizzato',
    '[████████████████████] 100% — SESSIONE AUTENTICATA ATTIVA',
    '> Accesso autorizzato. Premi o clicca ovunque per entrare...'
  ] : [
    'root@osinthub-ita:~# ./init_osint_kernel.sh --stealth',
    '[0.04s] Montaggio filesystem cifrato in memoria... [OK]',
    '[0.12s] Handshake TLS 1.3 con Cloudflare Edge Worker... [OK]',
    '[0.21s] Scansione socket & rilevamento proxy/VPN... [ATTIVO]',
    '[0.34s] Caricamento indici OSINT, Dorking, SOCMINT... [OK]',
    '[████████████████████] 100% — SISTEMA PRONTO',
    '> Premi o clicca ovunque per selezionare la modalità di accesso...'
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let currentBuffer = '';
  let stopped = false;

  const typeNext = () => {
    if(stopped) return;
    if(lineIdx >= lines.length){
      out.innerHTML = currentBuffer.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '<span class="term-cursor">█</span>';
      return;
    }
    const line = lines[lineIdx];
    if(charIdx < line.length){
      currentBuffer += line[charIdx];
      charIdx++;
      out.innerHTML = currentBuffer.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '<span class="term-cursor">█</span>';
      out.scrollTop = out.scrollHeight;
      setTimeout(typeNext, 14);
    } else {
      currentBuffer += '\n';
      lineIdx++;
      charIdx = 0;
      setTimeout(typeNext, 90);
    }
  };
  typeNext();

  let closed = false;
  const closeTerminal = () => {
    if(closed) return;
    closed = true;
    stopped = true;
    stopMatrix();
    try{ sessionStorage.setItem('osinthub_boot_shown', '1'); }catch{}
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.style.display = 'none';
      overlay.hidden = true;
      overlay.classList.remove('fade-out');

      if(justLoggedIn){
        window.history.replaceState({}, document.title, 'index.html');
        return;
      }
      if(welcomeModal){
        welcomeModal.style.display = 'grid';
      }
    }, 280);
  };

  overlay.addEventListener('click', closeTerminal);

  $('acceptGuest')?.addEventListener('click', () => {
    try{
      localStorage.setItem('osinthub_user', JSON.stringify({ name: 'Ospite', guest: true }));
      localStorage.setItem(ACCESS_KEY, 'guest');
      localStorage.setItem('legalSeen', '1');
    }catch{}
    syncUserNav();
    if(welcomeModal) welcomeModal.style.display = 'none';
  });

  $('switchAccessMode')?.addEventListener('click', () => {
    if(welcomeModal) welcomeModal.style.display = 'grid';
  });
}

/* ===== CATALOGO STRUMENTI OSINT ===== */
let data=[],categories={},active='',topic='';
function card(r){
  const a=el('article'),p=el('span',r.price),l=el('a','Apri strumento ↗'),b=el('a','⚑ Segnala un problema con il link');
  p.className='tag '+({Gratuito:'green',Freemium:'amber','A pagamento':'red'}[r.price]||'');
  if(/^https:\/\//.test(r.url)){l.href=r.url;l.target='_blank';l.rel='noopener noreferrer'}
  b.href='report.html?'+new URLSearchParams({name:r.name,url:r.url});
  b.className='report-link';
  const actions=el('div');actions.className='card-actions';actions.append(l,b);
  a.append(el('h3',r.name),p,el('p',r.description),actions);
  return a;
}
const norm=s=>s.toLocaleLowerCase('it').normalize('NFD').replace(/\p{Diacritic}/gu,'');
function render(){
  const q=norm($('search').value.trim());
  $('categories').replaceChildren();$('cards').replaceChildren();
  $('count').textContent=q?'Risultati della ricerca':data.length+' strumenti · 5 macroaree';
  let total=0;
  for(const [c,topics] of Object.entries(categories)){
    const rows=data.filter(r=>r.category===c&&(!q||norm([r.name,r.category,r.topic,r.description,r.url].join(' ')).includes(q)));
    if(q&&!rows.length)continue;
    total+=rows.length;
    const block=el('section');block.className='macro';
    const open=!!q||active===c;
    const b=el('button');b.className='macro-title';
    const idx=Object.keys(categories).indexOf(c);
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');
    svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.5');
    svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS(ns,'path');
    path.setAttribute('d',['M12 3a9 9 0 0 0-9 9m3 3v-3a6 6 0 0 1 12 0v4m-9 4v-8a3 3 0 0 1 6 0v7m-3-7v10M21 12a9 9 0 0 0-6-8','M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M2 12h20M12 2c-6 5-6 15 0 20 6-5 6-15 0-20','M3 8V3h5m8 0h5v5m0 8v5h-5m-8 0H3v-5M4 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4','M12 5v7m-6 7 6-7 6 7M9 2h6v5H9zM2 17h6v5H2zM16 17h6v5h-6z','M12 2 3 6v6c0 5 5 8 9 10 4-2 9-5 9-10V6zM8 12l3 3 5-6'][idx]);
    svg.append(path);
    const ico=el('span');ico.className='macro-icon';ico.append(svg);
    const title=el('span',c);title.className='macro-name';
    const num=el('span',String(rows.length));num.className='macro-count';
    const arrow=el('span',open?'⌄':'›');arrow.className='macro-arrow';arrow.setAttribute('aria-hidden','true');
    b.append(ico,title,num,arrow);
    block.classList.toggle('is-open',open);
    b.setAttribute('aria-expanded',String(open));
    b.onclick=()=>{if(q)$('search').value='';active=active===c?'':c;topic='';render();};
    block.append(b);
    if(open){
      const tabs=el('div');tabs.className='topics';
      if(!q){
        for(const t of ['Tutti',...topics]){
          const tb=el('button',t);
          tb.classList.toggle('active',topic===t||(!topic&&t==='Tutti'));
          tb.onclick=()=>{topic=t==='Tutti'?'':t;render()};
          tabs.append(tb);
        }
        block.append(tabs);
      }
      for(const t of topics){
        const group=rows.filter(r=>r.topic===t&&(q||!topic||topic===t));
        if(!group.length)continue;
        block.append(el('h3',t));
        const grid=el('div');grid.className='tool-grid';
        group.sort((a,b)=>a.name.localeCompare(b.name,'it')).forEach(r=>grid.append(card(r)));
        block.append(grid);
      }
    }
    $('categories').append(block);
  }
  if(q)$('count').textContent=total+' risultati';
  if(q&&!total)$('cards').append(el('p','Nessuno strumento trovato.'));
}

Promise.all(['resources','categories'].map(n=>fetch(n+'.json?v=2.2').then(r=>{if(!r.ok)throw Error();return r.json()})))
  .then(([r,c])=>{data=r;categories=c;render()})
  .catch(()=>$('count').textContent='Catalogo non disponibile. Riprova.');

$('toggleSearch')?.addEventListener('click', ()=>{
  const hidden=$('searchPanel').hidden;
  $('searchPanel').hidden=!hidden;
  $('toggleSearch').setAttribute('aria-expanded',String(hidden));
  if(hidden)$('search').focus();
  else{$('search').value='';render()}
});
$('search')?.addEventListener('input', render);

syncUserNav();
initCookieBanner();

// CONTROLLO SESSIONE: Mostra il terminale hacker e la modale solo se non c'è una sessione attiva (prima visita)
document.addEventListener('DOMContentLoaded', () => {
  const activeUser = localStorage.getItem('osinthub_user');
  const urlParams = new URLSearchParams(window.location.search);
  const justLoggedIn = urlParams.get('logged') === '1';

  if (!activeUser || justLoggedIn) {
    (function initEntryFlow(){
  const urlParams = new URLSearchParams(window.location.search);
  const justLoggedIn = urlParams.get('logged') === '1';
  const bootShown = sessionStorage.getItem('osinthub_boot_shown');

  if(justLoggedIn || !bootShown){
    runBootSequence();
  } else {
    const overlay = $('hackerTerminal');
    const welcomeModal = $('welcome');
    if(overlay){ overlay.style.display = 'none'; overlay.hidden = true; }
    if(welcomeModal){ welcomeModal.style.display = 'none'; }
  }
})();
  } else {
    const overlay = $('hackerTerminal');
    const welcomeModal = $('welcome');
    if(overlay) overlay.style.display = 'none';
    if(welcomeModal) welcomeModal.style.display = 'none';
  }
});
