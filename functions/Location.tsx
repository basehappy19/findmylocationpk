'use server'

import { prisma } from "@/lib/prisma"

export const revalidate = 0

export const getLocations = async () => {
    const result = await prisma.location.findMany()
    return result
}