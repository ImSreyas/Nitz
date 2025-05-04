// components/SuccessConfetti.jsx
import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const SuccessConfetti = () => {
  const { width, height } = useWindowSize();

  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={200}
      recycle={false} 
      gravity={0.4}
    />
  );
};

export default SuccessConfetti;
