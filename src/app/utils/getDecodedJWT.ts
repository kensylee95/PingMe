export const verifyAndGetDecodedJWT:(token:string)=>Promise<string> = async (token:string) => {
    const secret = process.env.JWT_SECRET||""
    try {
        const response = await fetch('/api/verifyJWT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, secret }),
        });

        const data = await response.json();

        if (data.success) {
            return data.decoded; // Access decoded data here
        } else {
            console.log('Invalid token:', data.message);
        }

    } catch (error) {
        console.error('Error:', error);
    }
};
