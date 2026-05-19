import { motion } from 'framer-motion';

export default function PageTransition({ children, className = '', ...props }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(10px)' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}
