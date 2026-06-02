export interface BinLookupResponse {
  number?: {
    iin?: string;
    length?: number;
    luhn?: boolean;
  };
  scheme?: string;
  type?: string;
  category?: string;
  country?: {
    alpha2?: string;
    alpha3?: string;
    name?: string;
    emoji?: string;
  };
  bank?: {
    name?: string;
    phone?: string;
    url?: string;
  };
  success?: boolean;
}

/**
 * Looks up BIN/IIN details using a public API.
 * Fully Edge-compatible using native fetch.
 * * @param bin - The 6 to 8 digit BIN/IIN number.
 * @returns BinLookupResponse or null if the lookup fails.
 */
export async function lookupBin(bin: string): Promise<BinLookupResponse | null> {
  const sanitizedBin = bin.replace(/\D/g, '').substring(0, 8);
  
  if (sanitizedBin.length < 6) {
    throw new Error('[cc-tester] BIN must be at least 6 digits long.');
  }

  try {
    // Standard public binlist API endpoint based on your schema requirements
    const response = await fetch(`https://lookup.binlist.net/${sanitizedBin}`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Version': '3'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as BinLookupResponse;
    data.success = true; // Appending the success flag as per your schema
    
    return data;
  } catch (error) {
    return null;
  }
}
