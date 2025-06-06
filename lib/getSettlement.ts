import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || 'Secret_of_JWT';

export async function getSettlement() {
    const cookieStore = await cookies();
    const token = (await cookieStore).get('auth_token')?.value;

    if (!token) {
        throw new Error("Authentication token not found.");
    }

    const payload = jwt.verify(token, SECRET_KEY);

    let username: string | undefined;
    if (typeof payload === "object" && payload !== null && "username" in payload) {
        username = (payload as jwt.JwtPayload).username as string;
    }

    if (!username) {
        throw new Error("Username not found in token payload.");
    }

    const prisma = new PrismaClient();
    const data = await prisma.others.findMany({
        where: {
            userId: username,
            balance: {
                not: 0,
            }
        }
    });

    return data;
}