function cleanOrigin(origin: string | null) {
  if (!origin) return "";

  try {
    const url = new URL(origin);
    return url.origin; // This gives ONLY protocol + host + port
  } catch {
    return "";
  }
}

export function corsHeaders(origin: string | null) {
      const clean = cleanOrigin(origin);

  return {
    "Access-Control-Allow-Origin": clean ,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}