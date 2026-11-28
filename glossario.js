'use strict';
const TERMS = [
  { term: 'OSINT', def: 'Open Source Intelligence: intelligence basata su fonti aperte e pubbliche.' },
  { term: 'SOCMINT', def: 'Social Media Intelligence: analisi delle informazioni pubbliche sui social network.' },
  { term: 'GEOINT / IMINT', def: 'Geospatial & Imagery Intelligence: geolocalizzazione e analisi di immagini e video.' },
  { term: 'ASN', def: 'Autonomous System Number: identificativo univoco di una rete IP su Internet.' },
  { term: 'EXIF', def: 'Exchangeable Image File Format: metadati tecnici incorporati nei file fotografici.' },
  { term: 'OPSEC', def: 'Operations Security: pratiche per proteggere l’identità e la sicurezza dell’analista.' }
];
const list = document.getElementById('glossaryList');
const inp = document.getElementById('glossSearch');
function renderGloss(q = ''){
  if(!list) return;
  list.replaceChildren();
  TERMS.filter(t => (t.term + ' ' + t.def).toLowerCase().includes(q.toLowerCase())).forEach(t => {
    const d = document.createElement('details');
    const s = document.createElement('summary'); s.textContent = t.term;
    const p = document.createElement('p'); p.textContent = t.def;
    d.append(s, p); list.append(d);
  });
}
if(inp) inp.oninput = () => renderGloss(inp.value);
renderGloss();
