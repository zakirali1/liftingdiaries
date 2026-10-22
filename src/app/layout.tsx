import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import Link from 'next/link'
import { DumbbellIcon } from 'lucide-react'
import './globals.css'
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Lifting Diaries',
  description: 'Log and track your workouts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <header className="flex justify-between items-center p-4 gap-4 h-16">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <DumbbellIcon className="size-6" />
              Lifting Diaries
            </Link>
            <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal" />
              <SignUpButton mode="modal">
                <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
