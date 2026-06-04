import { motion } from 'framer-motion';
import { useNexusStore } from '../../store/nexusStore';

export default function ModuleFallback({ retry }) {
  const { setPhase } = useNexusStore();

  const handleRetry = () => {
    if (retry) retry();
    else setPhase('hub');
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/90 text-[#0f0] font-mono z-[9998]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center p-6">
        <h2 className="text-2xl mb-4">Failed to load module</h2>
        <p className="mb-6">Something went wrong while fetching the content.</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-[#38b8d8] hover:bg-[#5ac5e0] transition"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  );
}
