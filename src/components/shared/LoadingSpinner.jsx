import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <motion.div
    className="flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </motion.div>
);

export default LoadingSpinner;