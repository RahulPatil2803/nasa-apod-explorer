import React, { useEffect, useMemo, useState } from 'react'
import { Apod, getByDate, getRecent, getToday } from './services/api'
import DatePicker from './components/DatePicker'
import ApodCard from './components/ApodCard'
import ApodDetail from './components/ApodDetail'
import Skeleton from './components/Skeleton'

export default function App() {
  const [today, setToday] = useState<Apod | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [byDate, setByDate] = useState<Apod | null>(null)
  const [gallery, setGallery] = useState<Apod[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const [detail, setDetail] = useState<Apod | null>(null)
  const [todayStr, setTodayStr] = useState<string>('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [t, g] = await Promise.all([getToday(), getRecent(3)])
        setToday(t)
        setGallery(g)
        const d = new Date().toISOString().slice(0,10)
        setTodayStr(d)
        setSelectedDate(d)
        setByDate(t) // avoid an extra call for today's date
      } catch (e: any) {
        setError(e?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!selectedDate) return
    // If user selects today, reuse the already-fetched today payload
    if (today && selectedDate === todayStr) {
      setByDate(today)
      return
    }
    const handle = setTimeout(async () => {
      try {
        const d = await getByDate(selectedDate)
        setByDate(d)
      } catch (e: any) {
        setError(e?.message || 'Failed to load for date')
      }
    }, 500)
    return () => clearTimeout(handle)
  }, [selectedDate, today, todayStr])

  const isVideo = useMemo(() => byDate?.media_type === 'video', [byDate])

  return (
    <div>
      <header className="p-4 border-b border-gray-800 sticky top-0 z-10 backdrop-blur bg-gray-950/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">NASA APOD Explorer</h1>
          <a className="text-sm text-blue-300 hover:text-blue-200 underline underline-offset-4" href="https://api.nasa.gov/" target="_blank">NASA API</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-8">
        {loading && (
          <section className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-9 w-36" />
              </div>
            </div>
          </section>
        )}
        {error && (
          <div className="rounded-md border border-red-800 bg-red-900/40 text-red-200 px-3 py-2">
            {error.includes('429') ? 'Rate limited by NASA API. Please wait a bit and try again.' : error}
          </div>
        )}

        {today && (
          <section className="grid md:grid-cols-2 gap-6 items-center bg-gray-900/50 border border-gray-800 rounded-2xl p-5 md:p-6 backdrop-blur-sm">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-200">Today's APOD</h2>
              <div className="text-sm text-gray-400">{today.date}</div>
              <div className="text-2xl font-bold text-white">{today.title}</div>
              <p className="text-gray-300 line-clamp-5">{today.explanation}</p>
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60 transition" onClick={() => setDetail(today)}>View details</button>
            </div>
            <div>
              {today.media_type === 'image' ? (
                <img src={today.url} alt={today.title} className="w-full rounded-lg border border-gray-800" />
              ) : (
                <iframe className="w-full aspect-video rounded-lg" src={today.url} title={today.title} allowFullScreen />
              )}
            </div>
          </section>
        )}

        <section className="space-y-4 bg-gray-900/50 border border-gray-800 rounded-2xl p-5 md:p-6 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-200">Browse by date</h2>
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
          </div>
          {byDate && (
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div>
                {isVideo ? (
                  <iframe className="w-full aspect-video rounded-lg" src={byDate.url} title={byDate.title} allowFullScreen />
                ) : (
                  <img src={byDate.url} alt={byDate.title} className="w-full rounded-lg border border-gray-800" />
                )}
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-400">{byDate.date}</div>
                <div className="text-2xl font-bold text-white">{byDate.title}</div>
                <p className="text-gray-300">{byDate.explanation}</p>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60 transition" onClick={() => setDetail(byDate)}>Open details</button>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3 bg-gray-900/50 border border-gray-800 rounded-2xl p-5 md:p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-200">Recent Gallery</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map(item => (
              <ApodCard key={item.date} item={item} onClick={() => setDetail(item)} />
            ))}
          </div>
        </section>
      </main>

      <ApodDetail item={detail} onClose={() => setDetail(null)} />

      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-400">
        Built with React, Vite, and Tailwind • Data: NASA APOD
      </footer>
    </div>
  )
}

