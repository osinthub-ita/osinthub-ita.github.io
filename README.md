# OSINTHUB-ITA — versione iniziale
1. Estrarre ZIP. Caricare i file della cartella nella radice del repository osinthub-ita/osinthub-ita.github.io (Add file > Upload files > Commit changes).
2. Settings > Pages > Deploy from a branch > main > / (root) > Save.
3. Prima di rendere pubblico, completare legal.html con dati del gestore e verifica legale; il catalogo ha classificazioni preliminari e URL non verificati individualmente.
4. Per aggiornare: aprire Gestione sul sito, selezionare o aggiungere risorsa, salvare nella copia, scaricare resources.json e caricarlo in sostituzione su GitHub. Non è un admin online.
5. Backend futuro: account, appunti, invio segnalazioni, modifica catalogo autenticata e log di sicurezza non sono attivi. Nessun Canarytoken o tracciamento nascosto. Configurare Supabase, RLS, MFA amministrativa, moderazione, limiti richieste e informative prima di attivare.
6. Il disegno vettoriale del banner è una prima interpretazione della grafica approvata, non una replica fotografica.


## Collegamento IP tramite Cloudflare Worker
La homepage invia una richiesta POST al Worker `osinthub-ip-check`.
Il Worker inoltra a ipapi.is l'IP della connessione e la chiave `IPAPI_KEY`
configurata come Secret su Cloudflare. La chiave non deve essere inserita
in `intelligence.js`, in altri file pubblici o nel repository.

Endpoint atteso:
`https://osinthub-ip-check.osinthub-3b0.workers.dev/`

Il sorgente del Worker è incluso in `cloudflare-worker.js` come copia di
riferimento. Se in futuro cambi il codice del Worker, aggiorna anche questa
copia. La homepage effettua il rilevamento all'apertura e poi ogni 5 minuti
mentre la pagina resta visibile.

## Contenuto di questo archivio
Archivio completo del repository, con le pagine e le risorse già presenti,
più gli aggiornamenti descritti sopra. Il catalogo contiene 107 voci in
5 macroaree. Le schede e i collegamenti devono essere verificati nel tempo.
