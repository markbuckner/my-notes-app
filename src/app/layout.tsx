import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../components/AuthContext';
import { NotesProvider } from '../components/NotesContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Notes App',
  description: 'A demo notes app built with Next.js and Supabase.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <NotesProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </NotesProvider>
    </AuthProvider>
  )
}
