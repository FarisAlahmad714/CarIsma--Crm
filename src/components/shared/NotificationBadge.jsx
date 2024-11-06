import { motion } from 'framer-motion';

const NotificationBadge = ({ count }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
  >
    {count}
  </motion.div>
);

export default NotificationBadge;