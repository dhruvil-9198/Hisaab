import { NextResponse } from "next/server";
import { serialize } from 'cookie';

export async function POST(req: Request) {
    const response = NextResponse.json({ success: true });

    response.headers.set(
        "Set-Cookie",
        serialize("auth_token", '', {
            httpOnly: true,
            path: "/",
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })
    );

    const redirectUrl = process.env.BASE_URL || "/";
    NextResponse.redirect(redirectUrl);

    return response;
}