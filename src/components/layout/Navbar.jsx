import { AnimatePresence, motion } from 'framer-motion';
import { BrainCircuit, Menu, Mic2, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import LanguageToggle from '../shared/LanguageToggle.jsx';
import TransitionNavLink from '../shared/TransitionNavLink.jsx';

const navItems = [
  { to: '/', key: 'home' },
  { to: '/voice', key: 'voice' },
  { to: '/mood', key: 'mood' },
  { to: '/anti-stress', key: 'stress' },
  { to: '/diary', key: 'diary' },
  { to: '/about', key: 'about' },
];

function navClass({ isActive }) {
  return [
    'nav-pill focus-ring',
    isActive ? 'nav-pill-active' : 'text-cloud/72 hover:text-white',
  ].join(' ');
}

export default function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 py-4 sm:px-6 lg:px-8">
      <nav className="premium-nav mx-auto flex max-w-[90rem] items-center justify-between px-3 py-3">
        <TransitionNavLink to="/" className="group flex min-w-0 items-center gap-3 rounded-full pr-2 focus-ring">
          <span className="brand-orb grid h-11 w-11 place-items-center rounded-full text-aqua">
            <BrainCircuit size={22} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-extrabold text-white sm:text-base">
              Ұстазға көмек ЖИ
            </span>
            <span className="block truncate text-xs font-semibold text-cloud/72">Мұғалімге жылы қолдау</span>
          </span>
        </TransitionNavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <TransitionNavLink key={item.to} to={item.to} className={navClass}>
              {t(`nav.${item.key}`)}
            </TransitionNavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          <TransitionNavLink to="/voice" className="premium-button min-h-11 px-4 text-sm focus-ring">
            <Mic2 size={18} />
            {t('actions.talk')}
          </TransitionNavLink>
        </div>

        <button
          type="button"
          className="icon-button focus-ring md:hidden"
          aria-label="Навигацияны ашу"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="premium-card mx-auto mt-3 max-w-[90rem] rounded-[1.35rem] p-3 md:hidden"
          >
            <div className="grid gap-1">
              {navItems.map((item) => (
                <TransitionNavLink
                  key={item.to}
                  to={item.to}
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  {t(`nav.${item.key}`)}
                </TransitionNavLink>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <LanguageToggle />
              <TransitionNavLink
                to="/voice"
                onClick={() => setOpen(false)}
                className="premium-button min-h-11 flex-1 px-4 text-sm focus-ring"
              >
                <Mic2 size={18} />
                {t('actions.talk')}
              </TransitionNavLink>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
