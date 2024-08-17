import React, { useEffect, useRef } from 'react';

const LottieAnimation = () => {
  const playerRef = useRef(null);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.pause();
      }
    };
  }, []);

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
    }
  };

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.play();
    }
  };

  return (
    <div>
      <dotlottie-player
        ref={playerRef}
        src="https://lottie.host/4cc7f0ac-15f0-469c-8f50-ad9c88d98161/83e92TFs58.json"
        background="transparent"
        speed="1"
        style={{ width: '300px', height: '300px' }}
        loop
      ></dotlottie-player>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handlePlay}>Play</button>
    </div>
  );
};

export default LottieAnimation;
