'use server'

import { prisma } from "@/lib/prisma"

export const getQuestions = async () => {
    const result = await prisma.question.findMany({
        include: {
            options: true
        }
    })
    return result
}