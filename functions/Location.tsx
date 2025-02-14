'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const getLocations = async () => {
    const result = await prisma.location.findMany()
    return result
}