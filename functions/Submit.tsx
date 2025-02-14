'use server'
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getMatchLocation = async ({ locations, nickname, userAgent, ipAddress }: { locations: number[], nickname: string, userAgent?: string, ipAddress?: string }) => {
    const optionLocations = await prisma.optionLocation.findMany({
        where: {
            optionId: { in: locations }
        },
        select: {
            locationId: true,
            score: true
        }
    });


    const locationScores: Record<number, number> = {};

    optionLocations.forEach(({ locationId, score }) => {
        if (!locationScores[locationId]) {
            locationScores[locationId] = 0;
        }
        locationScores[locationId] += score;
    });
    

    if (Object.keys(locationScores).length === 0) {
        const randomLocation = await prisma.location.findFirst();
        if (!randomLocation) throw new Error("ไม่มีสถานที่ในฐานข้อมูล");
        return randomLocation;
    }

    const maxScore = Math.max(...Object.values(locationScores));

    const topLocationIds = Object.entries(locationScores)
        .filter(([_, score]) => score === maxScore)
        .map(([locationId]) => Number(locationId));


    const topLocationId = topLocationIds.length > 1 
        ? topLocationIds[Math.floor(Math.random() * topLocationIds.length)] 
        : topLocationIds[0];


    const topLocation = await prisma.location.findUnique({
        where: { id: topLocationId },
    });

    if (!topLocation) {
        throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล Location");
    }

    await prisma.user.create({
        data: {
            nickname: nickname,
            userAgent: userAgent || null,
            ipAddress: ipAddress || null,
            locationId: topLocation.id
        }
    });
    revalidatePath(`/`)
    return topLocation;
};
