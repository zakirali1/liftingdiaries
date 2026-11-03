'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [router])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => router.back()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => router.back()}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
