import { Suspense, lazy } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ChooseMode from './pages/ChooseMode.jsx'
import Read from './pages/Read.jsx'

// The Perform page pulls in Framer Motion and dnd-kit, so load it on demand.
const Perform = lazy(() => import('./pages/Perform.jsx'))
const Report = lazy(() => import('./pages/Report.jsx'))

function Header() {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="hdr-flask" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#60a5fa" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path d="M12 4h8v8l6 12a3 3 0 0 1-2.7 4.3H8.7A3 3 0 0 1 6 24L12 12V4Z" fill="url(#hdr-flask)" stroke="#1e3a8a" strokeWidth="1.5" />
          <path d="M8.6 20h14.8L26 24a3 3 0 0 1-2.7 4.3H8.7A3 3 0 0 1 6 24l2.6-4Z" fill="#1d4ed8" opacity="0.75" />
          <rect x="10" y="2.5" width="12" height="3" rx="1.5" fill="#1e3a8a" />
        </svg>
        <Link to="/" className="text-lg font-bold tracking-tight text-slate-800 hover:text-blue-700">
          Virtual Chemistry Lab
        </Link>
        <span className="ml-auto hidden text-xs text-slate-500 sm:block">
          MSBTE K-Scheme &middot; Basic Science (Chemistry) 311305
        </span>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experiment/:id" element={<ChooseMode />} />
            <Route path="/experiment/:id/read" element={<Read />} />
            <Route path="/experiment/:id/perform" element={<Perform />} />
            <Route path="/experiment/:id/report" element={<Report />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="no-print border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        Virtual Chemistry Lab &mdash; practice before you enter the real lab.
      </footer>
    </div>
  )
}
