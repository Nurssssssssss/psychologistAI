import { motion } from 'framer-motion';

const paths = [
  {
    stroke: 'rgba(221, 231, 246, 0.9)',
    d: 'M227.549 1818.76C227.549 1818.76 406.016 2207.75 569.049 2130.26C843.431 1999.85 -264.104 1002.3 227.549 876.262C552.918 792.849 773.647 2456.11 1342.05 2130.26C1885.43 1818.76 14.9644 455.772 760.548 137.262C1342.05 -111.152 1663.5 2266.35 2209.55 1972.76C2755.6 1679.18 1536.63 384.467 1826.55 137.262C2013.5 -22.1463 2209.55 381.262 2209.55 381.262',
  },
  {
    stroke: 'rgba(85, 221, 224, 0.92)',
    d: 'M1661.28 2255.51C1661.28 2255.51 2311.09 1960.37 2111.78 1817.01C1944.47 1696.67 718.456 2870.17 499.781 2255.51C308.969 1719.17 2457.51 1613.83 2111.78 963.512C1766.05 313.198 427.949 2195.17 132.281 1455.51C-155.219 736.292 2014.78 891.514 1708.78 252.012C1437.81 -314.29 369.471 909.169 132.281 566.512C18.1772 401.672 244.781 193.012 244.781 193.012',
  },
];

function animationForPhase(phase) {
  if (phase === 'leaving') {
    return {
      strokeDashoffset: 0,
      strokeWidth: 700,
      opacity: 1,
    };
  }

  if (phase === 'entering') {
    return {
      strokeDashoffset: -1,
      strokeWidth: 200,
      opacity: 1,
    };
  }

  return {
    strokeDashoffset: 1,
    strokeWidth: 200,
    opacity: 0.96,
  };
}

export default function SvgPageTransition({ phase = 'idle' }) {
  const duration = phase === 'idle' ? 0 : 0.72;

  return (
    <div className="svg-page-transition" aria-hidden="true">
      <svg
        viewBox="0 0 2453 2535"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {paths.map((path) => (
          <motion.path
            key={path.d}
            d={path.d}
            stroke={path.stroke}
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray="1"
            initial={{
              strokeDashoffset: 1,
              strokeWidth: 200,
              opacity: 0.96,
            }}
            animate={animationForPhase(phase)}
            transition={{
              duration,
              ease: [0.45, 0, 0.55, 1],
            }}
          />
        ))}
      </svg>
    </div>
  );
}
