import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || 'Secret_of_JWT';


export default async function getTrans() {
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

    const data = await prisma.transaction.findMany({
        where: {
            userId: username,
        },
        orderBy: {
            Time: 'desc',
        }
    });

    // const dat = await prisma.$queryRaw`SELECT * FROM Transaction WHERE userId = ${username} ORDER BY Time DESC`

    return data;
}