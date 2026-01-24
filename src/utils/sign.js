export async function signAmount(amount) {
    const ts = Date.now();
    const payload = `${amount}|${ts}`;
  
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(import.meta.env.VITE_UPI_SIGN_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
  
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      enc.encode(payload)
    );
  
    const sigHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  
    return { ts, sig: sigHex };
  }
  