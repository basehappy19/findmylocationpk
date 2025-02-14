import React from 'react'
import PersonalityQuiz from './PersonalityQuiz'
import { getQuestions } from '@/functions/Question'
import { getLocations } from '@/functions/Location'
import { Question } from '@/interface/Question'
import { Location } from '@/interface/Location'
import { visitsCount } from '@/functions/Statistics'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ค้นหาตัวตนของเราเหมือนที่ไหนในโรงเรียนภูเขียว | Find My Building Phukhieo School',
    description: 'ทดสอบบุคลิกและค้นหาว่าเราเหมือนกับที่ไหนในโรงเรียนภูเขียวกันน',
    keywords: ['ค้นหาตัวตนของเรา', 'ทดสอบบุคลิกภาพ', 'โรงเรียนภูเขียว', 'อาคารเรียน', 'บุคลิกภาพ', 'ทดสอบความเหมือน', 'นิสัยคน'],
    openGraph: {
        title: 'ค้นหาตัวตนของเราเหมือนที่ไหนในโรงเรียนภูเขียว | Find My Building Phukhieo School',
        description: 'ทดสอบบุคลิกและค้นหาว่าเราเหมือนกับที่ไหนในโรงเรียนภูเขียวกันน',
        images: '/thumbnail.jpg',
        type: 'website',
    }
}



async function HomePage() {
    const questions: Question[] = await getQuestions()
    const locations: Location[] = await getLocations()
    const visits: number = await visitsCount()
    const data = {
        visits,
        questions,
        locations,
    }

    return (
        <PersonalityQuiz data={data} />
    )
}

export default HomePage