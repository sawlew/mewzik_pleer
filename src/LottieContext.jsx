import React, { createContext, useState, useContext } from 'react';

const LottieContext = createContext();

export const useLottie = () => useContext(LottieContext);

export const LottieProvider = ({ children }) => {
  const [isPlayingAnime, setIsPlayingAnime] = useState(false);

  const play = () => setIsPlayingAnime(true);
  const pause = () => setIsPlayingAnime(false);

  return (
    <LottieContext.Provider value={{ isPlayingAnime, play, pause }}>
      {children}
    </LottieContext.Provider>
  );
};