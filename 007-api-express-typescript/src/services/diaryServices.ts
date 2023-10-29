import { DiaryEntry, NewDiaryEntry, NonSensitiveInfoDiaryEntry } from '../types'
import diaryData from './diary.json'

// al importar de un json hay que indicar ' as Array<DiaryEntry>' para decirle a TypeScript que ese array es del tipo <DiaryEntry>
const diaries: DiaryEntry[] = diaryData as DiaryEntry[]

// Opción alternativa para usar el array de diaries.
// No se indica extension por lo que el orden de carga sería: 'tsx', '.ts', '.node', '.js', '.json'
// import diaryData from './_diary'
// const diaries: Array<DiaryEntry> = diaryData

export const getEntries = (): DiaryEntry[] => diaries

export const findById = (id: number): NonSensitiveInfoDiaryEntry | undefined => {
  const entry = diaries.find(d => d.id === id)
  if (entry != null) {
    const { comment, ...restOfDiary } = entry
    return restOfDiary
  }

  return undefined
}

export const getEntriesWithoutSensitiveInfo = (): NonSensitiveInfoDiaryEntry[] => diaries.map(({ id, date, weather, visibility }) => {
  return { id, date, weather, visibility }
})

export const addDiary = (newDiaryEntry: NewDiaryEntry): DiaryEntry => {
  const newDiary = {
    id: diaries.length + 1,
    ...newDiaryEntry
  }

  diaries.push(newDiary)
  return newDiary
}
