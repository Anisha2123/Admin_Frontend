import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const TransitionWrapper = styled(motion.div)`
  width: 100%;
  min-height: 100vh;
`;

const PageTransition = ({ children, isLoading }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <TransitionWrapper
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {children[0]} {/* LoadingScreen */}
        </TransitionWrapper>
      ) : (
        <TransitionWrapper
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
        >
          {children[1]} {/* Actual Content */}
        </TransitionWrapper>
      )}
    </AnimatePresence>
  );
};

export default PageTransition; 