import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AddTransaction, LendTrans } from "@/lib/addTransaction";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || 'Secret_of_JWT';

export async function POST(req: Request) {
    const cookieStore = cookies();
    const token = (await cookieStore).get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ success: false, error: "No auth token provided" }, { status: 401 });
    }

    const payload = jwt.verify(token, SECRET_KEY);

    const { trans, Lend, to, amt, desc } = await req.json();

    let username: string | undefined;
    if (typeof payload === "object" && payload !== null && "username" in payload) {
        username = (payload as jwt.JwtPayload).username as string;
    }

    if (!username) {
        return NextResponse.json({ success: false, error: "Invalid token payload" }, { status: 400 });
    }

    if (trans) {
        await AddTransaction(username, to, amt, desc);
        return NextResponse.json({ success: true });
    }

    await LendTrans(Lend, username, to, amt, desc)
    return NextResponse.json({ success: true });
}