const verifyJWT: (token: string, secret: string) => Promise<{ isValid: boolean, decoded?: string }> = async (token, secret) => {
    try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(secret),
            { name: 'HMAC', hash: "SHA-256" },
            false,
            ['verify']
        );

        // Split the token into its parts: header, payload, and signature
        const [header, payload, signature] = token.split('.');
        
        // If any part of the token is missing, the token is invalid
        if (!header || !payload || !signature) return { isValid: false };

        // Reconstruct the data (header.payload) to verify the signature
        const data = `${header}.${payload}`;
        
        // Decode the signature part from base64url
        const signatureArray = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

        // Verify the signature using HMAC and the provided secret key
        const isValid = await crypto.subtle.verify(
            'HMAC',
            key,
            signatureArray,
            encoder.encode(data)
        );

        // If the token is valid, decode the payload
        if (isValid) {
            const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))); // Decode and parse the payload
            return { isValid: true, decoded: decodedPayload };
        }

        return { isValid: false };

    } catch (e) {
        console.log(e)
        // If any error occurs (e.g., invalid token format), return as invalid
        return { isValid: false };
    }
};

export default verifyJWT;
