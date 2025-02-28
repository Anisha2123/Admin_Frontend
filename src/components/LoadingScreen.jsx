import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #2A0845 0%, #1B1464 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

const progress = keyframes`
  0% {
    stroke-dasharray: 0, 628;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 314, 314;
    stroke-dashoffset: -157;
  }
  100% {
    stroke-dasharray: 628, 0;
    stroke-dashoffset: -628;
  }
`;

const LoaderContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
`;

const SVGLoader = styled.svg`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  animation: rotate 2s linear infinite;
`;

const Circle = styled.circle`
  width: 100%;
  height: 100%;
  fill: none;
  stroke: #6C63FF;
  stroke-width: 4;
  stroke-linecap: round;
  animation: ${progress} 1.5s ease-in-out infinite;
`;

const LogoContainer = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Logo = styled(motion.img)`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const Message = styled(motion.p)`
  color: white;
  margin-top: 2rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

const dots = keyframes`
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60% { content: '...'; }
  80% { content: '....'; }
  100% { content: '.....'; }
`;

const Dots = styled.span`
  &::after {
    content: '.';
    animation: ${dots} 1.5s linear infinite;
  }
`;

const LoadingScreen = ({ message = "Loading" }) => {
  return (
    <Container>
      <LoaderContainer>
        <SVGLoader viewBox="0 0 200 200">
          <Circle cx="100" cy="100" r="90" />
        </SVGLoader>
        <LogoContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo
            src="https://res.cloudinary.com/dqt4zammn/image/upload/b_rgb:290846/c_crop,ar_1:1/v1739117879/KW_1_yeosmd.png"
            alt="KIITWALLAH"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />
          <Message
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {message}<Dots />
          </Message>
        </LogoContainer>
      </LoaderContainer>
    </Container>
  );
};

export default LoadingScreen; 