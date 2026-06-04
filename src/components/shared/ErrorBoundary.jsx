import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-[9999]"
          >
            <div className="text-center text-[#0f0] p-6 max-w-md">
              <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
              <p className="mb-6">{this.state.error?.toString()}</p>
              <button
                className="px-4 py-2 bg-[#38b8d8] hover:bg-[#5ac5e0] transition"
                onClick={() => window.location.reload()}
              >
                Reload Application
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      );
    }
    return this.props.children;
  }
}
