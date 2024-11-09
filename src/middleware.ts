import { NextRequest, NextResponse } from "next/server";
import authMiddleware from "./middlewares/authMiddleware";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Apply auth middleware for specific paths
    if (pathname.startsWith("/chat/inner")) {
        const response:NextResponse = await authMiddleware(request);
       return response
    }

    // Allow all other requests to proceed
    return NextResponse.next();
}

export const config = {
    matcher: '/chat/inner/:path*'
};
