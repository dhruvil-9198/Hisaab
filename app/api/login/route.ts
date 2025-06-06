import { ValidateUser, GenerateToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { serialize } from 'cookie';

export async function POST(req: Request) {
    const { email, username, password } = await req.json();

    const user = await ValidateUser(password, email, username);

    if (!user)
        return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });

    const token = GenerateToken(user);

    const response = NextResponse.json({ success: true });

    response.headers.set(
        "Set-Cookie",
        serialize("auth_token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })
    );

    const redirectUrl = process.env.BASE_URL || "/";
    NextResponse.redirect(redirectUrl);

    return response;
}