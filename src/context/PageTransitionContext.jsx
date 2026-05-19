import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import SvgPageTransition from '../components/shared/SvgPageTransition.jsx';

const PageTransitionContext = createContext(null);
const phaseDurationMs = 720;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function PageTransitionProvider({ children }) {
  const [phase, setPhase] = useState('idle');
  const isRunning = useRef(false);

  const runPageTransition = useCallback(async (commit) => {
    if (typeof window === 'undefined' || prefersReducedMotion()) {
      commit();
      return;
    }

    if (isRunning.current) return;

    isRunning.current = true;
    setPhase('leaving');

    await wait(phaseDurationMs);
    commit();
    window.scrollTo(0, 0);

    setPhase('entering');
    await wait(phaseDurationMs);

    setPhase('idle');
    isRunning.current = false;
  }, []);

  const value = useMemo(
    () => ({
      isTransitioning: phase !== 'idle',
      runPageTransition,
    }),
    [phase, runPageTransition],
  );

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
      <SvgPageTransition phase={phase} />
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error('usePageTransition must be used inside PageTransitionProvider');
  }

  return context;
}
