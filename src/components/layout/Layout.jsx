import Navbar from './Navbar.jsx';
import AmbientBackground from '../shared/AmbientBackground.jsx';
import CursorAura from '../shared/CursorAura.jsx';

export default function Layout({ children }) {
  return (
    <div className="app-shell min-h-screen overflow-hidden text-cloud">
      <AmbientBackground />
      <CursorAura />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[1] h-32 border-b border-ink/8 bg-ink/20 backdrop-blur-2xl" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-4 pb-16 pt-5 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="relative z-10 border-t border-ink/10 px-4 py-7 text-center text-sm text-cloud/70 backdrop-blur-xl">
          Ұстазға көмек ЖИ - мұғалімдерге арналған эмоциялық қолдау платформасы
        </footer>
      </div>
    </div>
  );
}
