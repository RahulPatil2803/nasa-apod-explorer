import React from 'react'
import { Apod } from '../services/api'

type Props = {
  item: Apod
  onClick?: () => void
}

export default function ApodCard({ item, onClick }: Props) {
  return (
    <div className="group rounded-lg overflow-hidden bg-gray-900 border border-gray-800 hover:border-gray-700 transition shadow-sm hover:shadow-md cursor-pointer" onClick={onClick}>
      {item.media_type === 'image' ? (
        <img src={item.url} alt={item.title} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" />
      ) : (
        <div className="w-full h-56 flex items-center justify-center bg-black/70 text-sm text-gray-200">
          <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-800/70 border border-gray-700">▶ Video</span>
        </div>
      )}
      <div className="p-3">
        <div className="text-sm text-gray-400">{item.date}</div>
        <div className="font-semibold line-clamp-2">{item.title}</div>
      </div>
    </div>
  )
}
