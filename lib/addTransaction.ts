import { PrismaClient } from "@prisma/client";
import Decimal from "decimal.js";

const prisma = new PrismaClient();

export async function AddTransaction(username: string, to: string, amt: Decimal, desc: string) {
    const trans = await prisma.transaction.create({
        data: {
            userId: username,
            Lend: false,
            Amount: amt,
            To: to,
            Description: desc,
        }
    })
}


export async function LendTrans(Lend: boolean, username: string, to: string, amt: Decimal, desc: string) {
    to = to.toLowerCase();
    let user = await prisma.others.findFirst({
        where: {
            userId: username,
            username: to,
        }
    });

    if (!user) {
        user = await prisma.others.create({
            data: {
                username: to,
                userId: username,
                balance: 0,
            }
        })
    }

    const transaction = await prisma.transaction.create({
        data: {
            userId: username,
            Lend: true,
            Amount: Lend ? amt : (-1) * Number(amt),
            To: to,
            Description: desc,
        }
    });

    await prisma.others.update({
        data: {
            balance: Number(user.balance) + (Lend ? Number(amt) : (-1) * Number(amt)),
        },
        where: {
            username: to,
        }
    });
}