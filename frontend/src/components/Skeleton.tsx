import React from 'react'

export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-800/60 ${className}`} />
  )
}
