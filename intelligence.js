'use strict';
(()=>{const g=id=>document.getElementById(id);let timer=null,controller=null,enabled=true,sequence=0;
const clock=(zone)=>new Intl.DateTimeFormat('it-IT',{timeZone:zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',timeZoneName:'short'}).format(new Date());
function tick(){if(g('itclock'))g('itclock').textContent=clock('Europe/Rome');if(g('utcclock'))g('utcclock').textContent=clock('UTC')}
tick();setInterval(tick,1000);
function isNetworkDiagAllowed(){
  try{
    const raw = localStorage.getItem('osinthub_cookie_consent_v1');
    if(!raw) return true;
    const parsed = JSON.parse(raw);
    return parsed.networkDiag !== false;
  }catch{return true}
}
const field=(k,v)=>{const a=document.createElement('dt'),b=document.createElement('dd');a.textContent=k;b.textContent=v||'Non disponibile';g('footprint').append(a,b)};
function footprint(d={}){
  if(!g('footprint'))return;
  g('footprint').replaceChildren();
  const ua=navigator.userAgent;
  field('Sistema operativo',navigator.userAgentData?.platform||(/Android/.test(ua)?'Android':/iPhone|iPad/.test(ua)?'iOS / iPadOS':/Windows/.test(ua)?'Windows':/Mac/.test(ua)?'macOS':/Linux/.test(ua)?'Linux':'Non determinabile'));
  field('Browser',/Edg\//.test(ua)?'Edge':/Firefox|FxiOS/.test(ua)?'Firefox':/Chrome|CriOS/.test(ua)?'Chrome':/Safari/.test(ua)?'Safari':'Non determinabile');
  field('Schermo (pixel CSS)',screen.width+' × '+screen.height);
  field('Lingua',navigator.language);
  field('Fuso orario',Intl.DateTimeFormat().resolvedOptions().timeZone);
  field('HTTPS',location.protocol==='https:'?'Attivo':'Non attivo');
  field('Cookie (browser)',navigator.cookieEnabled?'Abilitati':'Disabilitati');
  field('IP pubblico',d.ip);
  field('Operatore / titolare rete',d.company);
  field('ASN',d.asn);
  field('Paese IP',d.country);
  field('Città IP indicativa',d.city);
  field('VPN',vpnLabel(d));
  field('Proxy',typeof d.is_proxy==='boolean'?(d.is_proxy?'Rilevato':'Non rilevato'):'Non determinabile');
  field('Tor',typeof d.is_tor==='boolean'?(d.is_tor?'Rilevata':'Non rilevata'):'Non determinabile');
}
const countryNames=new Intl.DisplayNames(['en'],{type:'region'}), italianNames=new Intl.DisplayNames(['it'],{type:'region'});
const countries={};
for(let a=65;a<=90;a++)for(let b=65;b<=90;b++){const code=String.fromCharCode(a,b),name=countryNames.of(code);if(name!==code)countries[name.toLowerCase()]=code}
function place(geo){
  const code=geo.country_code||countries[String(geo.country||'').toLowerCase()];
  const valid=/^[A-Z]{2}$/.test(code||'');
  const flag=valid?String.fromCodePoint(...Array.from(code,c=>127397+c.charCodeAt(0)))+' ':'';
  return flag+[geo.city,geo.region,valid?italianNames.of(code):geo.country].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(', ');
}
function vpnLabel(d){
  const name=typeof d.vpn?.service==='string'?d.vpn.service.trim():'';
  return name?'Rilevata: '+name:d.is_vpn?'Rilevata, gestore sconosciuto':d.is_vpn===false?'Non rilevata':'Non determinabile';
}
footprint();
function clearNetwork(msg){
  if(g('ipinfo'))g('ipinfo').textContent='Il tuo IP è: non disponibile';
  if(g('netinfo'))g('netinfo').textContent=msg;
  if(g('vpninfo')){g('vpninfo').textContent='VPN: non determinabile';g('vpninfo').dataset.state='unknown';}
  if(g('countryinfo'))g('countryinfo').textContent='';
  if(g('mapinfo'))g('mapinfo').textContent='Posizione IP non disponibile.';
  if(g('mapdot'))g('mapdot').setAttribute('visibility','hidden');
  footprint();
}
async function lookup(){
  if(!enabled)return;
  if(!isNetworkDiagAllowed()){ clearNetwork('ISP: analisi IP disattivata dalle preferenze cookie'); return; }
  const seq=++sequence; controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),10000);
  try{
    const r=await fetch('https://osinthub-ip-check.osinthub-3b0.workers.dev/',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}',signal:controller.signal,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});
    if(!r.ok)throw Error('HTTP '+r.status);
    const d=await r.json();
    if(!d.ip||d.error)throw Error('Risposta non disponibile');
    if(seq!==sequence)return;
    g('ipinfo').textContent='Il tuo IP è: '+d.ip;
    const company=d.company?.name||(typeof d.company==='string'?d.company:d.asn?.org||'N/D');
    const asn=typeof d.asn==='string'?d.asn:d.asn?.asn?'AS'+d.asn.asn:'N/D';
    g('netinfo').textContent='Gestore rete pubblica: '+company+' · ASN: '+asn;
    const geo=d.location||d;
    g('vpninfo').textContent='VPN: '+vpnLabel(d);
    g('vpninfo').dataset.state=d.vpn?.service||d.is_vpn?'detected':d.is_vpn===false?'clear':'unknown';
    g('countryinfo').textContent=place(geo)||'Posizione non disponibile';
    footprint({...d,company,asn,country:geo.country,city:geo.city});
    const lat=geo.latitude??geo.lat,lon=geo.longitude??geo.lon;
    g('mapinfo').textContent=[geo.city,geo.country].filter(Boolean).join(', ')||'Posizione non disponibile';
    if(typeof lat==='number'&&typeof lon==='number'&&Math.abs(lat)<=90&&Math.abs(lon)<=180){
      g('mapdot').setAttribute('cx',lon+180); g('mapdot').setAttribute('cy',90-lat); g('mapdot').setAttribute('visibility','visible');
    }else g('mapdot').setAttribute('visibility','hidden');
    timer=setTimeout(()=>{if(!document.hidden)lookup();else timer=setTimeout(waitVisible,300000)},300000);
  }catch(e){
    if(seq===sequence){ clearNetwork('ISP: servizio non disponibile'); timer=setTimeout(waitVisible,300000); }
  }finally{clearTimeout(timeout)}
}
function waitVisible(){ if(!enabled)return; if(document.hidden)timer=setTimeout(waitVisible,300000); else lookup(); }
window.addEventListener('osint:consent-updated', ()=>{ clearTimeout(timer); if(isNetworkDiagAllowed()) lookup(); else clearNetwork('ISP: analisi IP disattivata dalle preferenze cookie'); });
waitVisible();
function links(node,rows){
  if(!node)return; node.replaceChildren();
  for(const r of rows){
    if(!/^https:\/\//.test(r.url))continue;
    const a=document.createElement('a'); a.href=r.url; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent=r.name+' ↗';
    node.append(a);
  }
}
fetch('resources.json?v=2.2').then(r=>{if(!r.ok)throw Error();return r.json()}).then(rows=>links(g('recentlinks'),rows.slice(-6))).catch(()=>{if(g('recentlinks'))g('recentlinks').textContent='Catalogo non disponibile.'});
})();
