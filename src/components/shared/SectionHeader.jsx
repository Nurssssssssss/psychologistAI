import { motion } from 'framer-motion';

export default function SectionHeader({ eyebrow, title, children, align = 'left' }) {
  const centered = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={centered ? 'mx-auto max-w-4xl text-center' : 'max-w-4xl'}
    >
      {eyebrow ? (
        <p className="eyebrow-chip mb-4">{eyebrow}</p>
      ) : null}
      <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.03] text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {children ? <div className="mt-5 text-base leading-8 text-cloud/82 sm:text-lg">{children}</div> : null}
    </motion.div>
  );
}
