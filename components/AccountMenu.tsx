'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { UserCircle } from 'lucide-react'

export default function AccountMenu() {
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setNotice(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-white/85 hover:text-gold transition-colors text-sm"
      >
        <UserCircle size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 shadow-lg z-50 text-ink">
          {notice ? (
            <p className="p-4 text-xs text-slate-600 leading-relaxed">
              This is a design prototype — author and editorial accounts aren&apos;t
              connected yet. That requires the editorial CMS described in the
              site brief, which is a separate build.
            </p>
          ) : (
            <div className="py-2">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm hover:bg-soft-gold/50"
              >
                Dashboard
              </Link>
              <button
                onClick={() => setNotice(true)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-soft-gold/50"
              >
                Sign In
              </button>
              <button
                onClick={() => setNotice(true)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-soft-gold/50"
              >
                Create Author Account
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
