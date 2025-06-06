import { PrismaClient, User } from "@prisma/client"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const SECRET_KEY = process.env.JWT_SECRET || 'Secret_of_JWT';
const prisma = new PrismaClient();

const saltRounds = 11;
const hashPassword = async (plainTextPassword: string): Promise<string> => {
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    return hash;
};


export async function getUser(): Promise<User | null> {
    const cookiestore = cookies();
    const token = (await cookiestore).get('auth_token')?.value;

    if (!token) {
        return null;
    }

    const payload = jwt.verify(token, SECRET_KEY);
    let username: string | undefined;
    if (typeof payload === "object" && payload !== null && "username" in payload) {
        username = (payload as jwt.JwtPayload).username as string;
    }

    const user = await prisma.user.findFirst({
        where: {
            username,
        }
    });
    return user;
}


export async function changeName(newName: string, id: string) {
    await prisma.user.update({
        data: {
            name: newName,
        },
        where: {
            id,
        }
    })
}

export async function changePass(oldPass: string, password: string, id: string) {

    const user = await prisma.user.findFirst({
        where: {
            id,
        }
    })
    if (!user)
        return false;

    if (!(await bcrypt.compare(oldPass, user.password)))
        return false;

    password = await hashPassword(password);
    await prisma.user.update({
        data: {
            password,
        },
        where: {
            id,
        }
    })

    return true;
}