import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';

function TestApp() {
  const [show, setShow] = useState(true);
  
  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle</button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={undefined}
            transition={{ duration: 1 }}
            style={{ width: 100, height: 100, background: 'red' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<TestApp />);
