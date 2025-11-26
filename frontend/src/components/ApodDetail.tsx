import React from 'react'
import { Apod } from '../services/api'

type Props = {
  item: Apod | null
  onClose: () => void
}

export default function ApodDetail({ item, onClose }: Props) {
  if (!item) return null
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900/95 backdrop-blur border border-gray-700 rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <button onClick={onClose} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 transition">Close</button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-4 space-y-4">
          {item.media_type === 'image' ? (
            <img src={item.hdurl || item.url} alt={item.title} className="w-full object-contain rounded-lg border border-gray-800" />
          ) : (
            <iframe className="w-full aspect-video rounded-lg border border-gray-800" src={item.url} title={item.title} allowFullScreen />
          )}
          <div className="text-sm text-gray-400">{item.date} {item.copyright ? `• © ${item.copyright}` : ''}</div>
          <p className="leading-relaxed text-gray-200 whitespace-pre-wrap">{item.explanation}</p>
        </div>
      </div>
    </div>
  )
}

