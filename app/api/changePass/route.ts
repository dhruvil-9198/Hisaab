import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { changePass } from "@/lib/getUser";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || 'Secret_of_JWT';

export async function POST(req: Request) {
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ success: false, error: "No auth token provided" }, { status: 401 });
    }

    let payload;

    try {
        payload = jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
    }

    const { oldPass, password } = await req.json();

    let userId: string | undefined;
    if (typeof payload === "object" && payload !== null && "id" in payload) {
        userId = (payload as jwt.JwtPayload).id as string;
    }

    if (!userId) {
        return NextResponse.json({ success: false, error: "Invalid token payload" }, { status: 400 });
    }

    const res = await changePass(oldPass, password, userId)

    if (res)
        return NextResponse.json({ success: true }, { status: 200 });
    else
        return NextResponse.json({ success: false, error: "Old password is incorrect" }, { status: 400 });
}