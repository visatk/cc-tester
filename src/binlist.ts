export interface BinLookupResponse {
  number?: { iin?: string; length?: number; luhn?: boolean; };
  scheme?: string;
  type?: string;
  category?: string;
  country?: { alpha2?: string; alpha3?: string; name?: string; emoji?: string; };
  bank?: { name?: string; phone?: string; url?: string; };
  success?: boolean;
}

export interface BinLookupOptions {
  timeoutMs?: number; // Cloudflare Worker execution time safety
}

/**
 * Looks up BIN/IIN details using a public API.
 * Edge-optimized with AbortController to prevent Worker execution timeouts.
 */
export async function lookupBin(bin: string, options?: BinLookupOptions): Promise<BinLookupResponse | null> {
  const sanitizedBin = bin.replace(/\D/g, '').substring(0, 8);
  
  if (sanitizedBin.length < 6) {
    throw new Error('[cc-tester] BIN must be at least 6 digits long.');
  }

  // Defend against hanging requests in Edge environments (Default: 4 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options?.timeoutMs || 4000);

  try {
    const response = await fetch(`https://lookup.binlist.net/${sanitizedBin}`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Version': '3'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as BinLookupResponse;
    data.success = true;
    
    return data;
  } catch (_error) { // <-- Fixed here
    clearTimeout(timeoutId);
    // Gracefully handle AbortError or network failures without crashing the Worker
    return null; 
  }
}
