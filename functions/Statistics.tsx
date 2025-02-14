'use server'
import { prisma } from "@/lib/prisma"

export const visitsCount = async () => {
    const result = await prisma.user.count();
    return result;
}