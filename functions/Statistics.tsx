'use server'
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";

export const visitsCount = async () => {
    const result = await prisma.user.count();
    revalidatePath(`/`)
    return result;
}