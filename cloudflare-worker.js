const SITE = "https://osinthub-ita.github.io";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = {
      "Access-Control-Allow-Origin": SITE,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    };

    if (origin !== SITE) {
      return new Response(JSON.stringify({ error: "Origine non autorizzata" }), {
        status: 403,
        headers
      });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Metodo non consentito" }), {
        status: 405,
        headers
      });
    }

    if (!env.IPAPI_KEY) {
      return new Response(JSON.stringify({ error: "Chiave API non configurata" }), {
        status: 503,
        headers
      });
    }

    try {
      const clientIP = request.headers.get("CF-Connecting-IP");
      if (!clientIP) {
        return new Response(JSON.stringify({ error: "IP non disponibile" }), {
          status: 400,
          headers
        });
      }

      const apiResponse = await fetch("https://api.ipapi.is/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: clientIP, key: env.IPAPI_KEY })
      });

      const body = await apiResponse.text();
      return new Response(body, {
        status: apiResponse.status,
        headers
      });
    } catch {
      return new Response(JSON.stringify({
        error: "Errore nel servizio di geolocalizzazione"
      }), {
        status: 502,
        headers
      });
    }
  }
};
