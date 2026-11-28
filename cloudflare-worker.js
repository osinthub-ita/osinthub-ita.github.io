export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': 'https://osinthub-ita.github.io',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: cors });

    const ip = request.headers.get('CF-Connecting-IP') || '';
    const cf = request.cf || {};
    if (!ip) return new Response(JSON.stringify({ error: 'IP non rilevato' }), { status: 400, headers: cors });

    try {
      if (env.IPAPI_KEY) {
        const res = await fetch(`https://api.ipapi.is/?q=${encodeURIComponent(ip)}&key=${encodeURIComponent(env.IPAPI_KEY)}`);
        if (res.ok) {
          const data = await res.json();
          return new Response(JSON.stringify(data), { headers: cors });
        }
      }
    } catch (e) {}

    return new Response(JSON.stringify({
      ip,
      asn: cf.asn ? `AS${cf.asn}` : 'N/D',
      company: cf.asOrganization || 'N/D',
      location: {
        country_code: cf.country || '',
        country: cf.country || '',
        region: cf.region || '',
        city: cf.city || '',
        latitude: cf.latitude ? Number(cf.latitude) : null,
        longitude: cf.longitude ? Number(cf.longitude) : null
      },
      is_vpn: null,
      is_proxy: null,
      is_tor: null
    }), { headers: cors });
  }
};
