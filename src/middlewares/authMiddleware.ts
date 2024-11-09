import { NextRequest, NextResponse } from "next/server";
import verifyJWT from "@/app/utils/verifyJWT";

const authMiddleware : (request: NextRequest) => Promise<NextResponse> = async (request) => {
    const token = request.cookies.get("authToken")?.value; 
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!token) {
        console.log("No token found");
        // Redirect to login
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        // Verify the token
       const verify =  await verifyJWT(token, jwtSecret)
       console.log(verify.decoded)
        return NextResponse.next();
    } catch (error) {
        console.log("Token verification failed:", error);
        // Redirect to login if verification fails
        return NextResponse.redirect(new URL('/auth/notVerified', request.url));
    }
};

export default authMiddleware;
