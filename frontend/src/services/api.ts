import axios from 'axios'

export type Apod = {
  date: string
  title: string
  explanation: string
  url: string
  hdurl?: string
  media_type: 'image' | 'video'
  copyright?: string
}

const base = import.meta.env.VITE_API_BASE || '/api'
const http = axios.create({ baseURL: base })

export async function getToday(): Promise<Apod> {
  const { data } = await http.get<Apod>('/apod/today')
  return data
}

export async function getByDate(date: string): Promise<Apod> {
  const { data } = await http.get<Apod>('/apod/by-date', { params: { date } })
  return data
}

export async function getRecent(days = 7): Promise<Apod[]> {
  const { data } = await http.get<Apod[]>('/apod/recent', { params: { days } })
  return data
}
