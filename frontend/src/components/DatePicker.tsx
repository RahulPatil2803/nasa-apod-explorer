import React from 'react'

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function DatePicker({ value, onChange }: Props) {
  return (
    <input
      type="date"
      className="bg-gray-900 border border-gray-700 rounded px-3 py-2"
      value={value}
      min={"1995-06-16"}
      max={new Date().toISOString().slice(0,10)}
      onChange={e => onChange(e.target.value)}
    />
  )
}
