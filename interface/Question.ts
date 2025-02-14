import { Option } from "./Option"

export interface Question {
    id: number
    text: string
    options: Option[]
}