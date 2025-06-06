import { NextResponse } from "next/server";
import { CheckUsername, CheckEmail, CreateUser } from "@/lib/auth";

export async function POST(req: Request) {
    const { name, email, username, password } = await req.json();

    if (await CheckUsername(username))
        return NextResponse.json({ error: "Username not available" }, { status: 401 });
    if (await CheckEmail(email))
        return NextResponse.json({ error: "Email Id already registered" }, { status: 401 });

    await CreateUser(name, email, username, password);

    const response = await fetch(`${process.env.BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            username,
            password
        }),
    });

    return response;
}