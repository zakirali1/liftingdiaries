'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label="Close"
          onClick={() => router.back()}
          className="absolute -top-3 -right-3 z-10 rounded-full shadow"
        >
          <XIcon />
        </Button>
        {children}
      </div>
    </div>
  )
}
