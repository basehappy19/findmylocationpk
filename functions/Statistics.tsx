'use server'
import { prisma } from "@/lib/prisma"

export const revalidate = 0

export const visitsCount = async () => {
    const result = await prisma.user.count();
    return result;
}