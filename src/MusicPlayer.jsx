import React, { useState, useEffect, useRef } from 'react';
import Playlist from './Playlist';
import { parseBlob } from 'music-metadata';
import { Buffer } from 'buffer';
import process from 'process';
import coverPhoto from './assets/art.jpeg'

window.Buffer = Buffer;
window.process = process;

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [metadata, setMetadata] = useState({
    title: 'Unknown Title',
    artist: 'Unknown Artist',
    albumArt: {coverPhoto}
  });
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (songs.length > 0) {
        audioRef.current.load();
        if (shouldPlay) {
          audioRef.current.play();
        }
      }
    }
  }, [currentSongIndex, songs, shouldPlay]);

  const handleFiles = async (event) => {
    const files = event.target.files;
    if (!files.length) return;
  
    const wasPlaying = isPlaying;
    setLoading(true);
  
    try {
      const loadedSongs = await Promise.all(
        Array.from(files).map(async (file) => {
          const metadata = await parseBlob(file);
          let albumArt = coverPhoto;
  
          if (metadata?.common?.picture?.[0]?.data) {
            try {
              const blob = new Blob([metadata.common.picture[0].data], { type: metadata.common.picture[0].format });
              albumArt = URL.createObjectURL(blob);
            } catch (err) {
              console.error('Error creating album art Blob URL:', err);
            }
          }
  
          // console.log('Album Art URL:', albumArt);
  
          return {
            title: metadata?.common?.title || file.name,
            artist: metadata?.common?.artist || 'Unknown Artist',
            albumArt,
            src: URL.createObjectURL(file),
          };
        })
      );
  
      if (loadedSongs.length > 0) {
        setSongs((prevSongs) => [...prevSongs, ...loadedSongs]);
        if (songs.length === 0) {
          setCurrentSongIndex(0);
        }
      }
    } catch (error) {
      console.error('Error processing files:', error);
      console.error('Error processing files:', error.message, error);
    }
    setLoading(false);
    if (wasPlaying && audioRef.current) {
      audioRef.current.play();
    }
  };
  
  

  useEffect(() => {
    if (songs.length > 0) {
      const currentSong = songs[currentSongIndex];
      setMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        albumArt: currentSong.albumArt,
      });
    }
  }, [currentSongIndex, songs]);

  const playSong = () => {
    if (!audioRef.current) return;

    audioRef.current.play();
    setIsPlaying(true);
    setShouldPlay(true);
  };

  const pauseSong = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
  };

  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  // const playNext = () => {
  //   setCurrentSongIndex((currentSongIndex + 1) % songs.length);
  //   setShouldPlay(true);
  //   setIsPlaying(true);
  // };

  const playNext = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      let nextIndex;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * songs.length);
      } else {
        nextIndex = (currentSongIndex + 1) % songs.length;
      }
      setCurrentSongIndex(nextIndex);
    }
  };

  const playPrev = () => {
    setCurrentSongIndex((currentSongIndex - 1 + songs.length) % songs.length);
    setShouldPlay(true);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;

    setDuration(audioRef.current.duration);
  };

  const handleProgressChange = (event) => {
    if (!audioRef.current) return;

    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // const togglePlaylist = () => {
  //   setShowPlaylist(!showPlaylist);
  // };

  const handleTrackSelection = (index) => {
    setCurrentSongIndex(index);
    setShouldPlay(true);
    setIsPlaying(true);
    console.log(index);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const removeSong = (index) => {
    setSongs((prevSongs) => prevSongs.filter((_, i) => i !== index));

    if (index === currentSongIndex) {
      setCurrentSongIndex(0);
      setShouldPlay(false);
      setIsPlaying(false);
    } else if (index < currentSongIndex) {
      setCurrentSongIndex((prevIndex) => prevIndex - 1);
    }
  };

 
  return (
    <div>
      <div className='text-center'>
        <button className='bg-[#9c1313] px-4 py-1 rounded-md active:bg-transparent active:border active:border-[#9c1313]'
          onClick={() => fileInputRef.current.click()}>
          {songs.length === 0 ? 'Add Song(s)' : 'Add more Song(s)'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.ogg,.aac"
          multiple
          style={{ display: 'none' }}
          onChange={handleFiles}
        />
      </div>

      {loading && <div className='text-center'>Loading songs, please wait...</div>}
      {!loading && (
        <>
          {songs.length === 0 ? (
            <p className='text-center mt-10'>Playlist is empty</p>
          ) : (
            <>
            <div className={`bg-[#750e0e9c] absolute w-full bottom-0 backdrop-blur-md transition-all duration-500 ease-in-out ${ fullscreen ? 'h-full' : '' }`}>
                <div className={`max-w-6xl flex justify-center items-center gap-2 p-4 mx-auto
                  ${ fullscreen ? 'h-full flex-col text-center' : '' }
                  `}>
                  <div>
                    <div>
                      <img
                      className={`mx-auto w-[100px] h-[100px] rounded-lg
                        ${ fullscreen ? 'w-[300px] h-[300px] sm:w-[350px] sm:h-[350px]' : ''}
                        `}
                        src={metadata.albumArt}
                        alt="Album Art"
                      />
                    </div>

                  </div>
                  <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={playNext}
                  >
                    <source src={songs[currentSongIndex].src} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                  <div className='w-[calc(100%-110px)]'>
                    <div className=''>
                      <h2 className='whitespace-nowrap truncate text-lg font-bold'>{metadata.title}</h2>
                      <h3 className='whitespace-nowrap truncate'>{metadata.artist}</h3>
                    </div>
                    <div className='flex items-center gap-2 py-2'>
                      <span className='text-xs'>{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime || 0}
                        onChange={handleProgressChange}
                        className='accent-red-500 appearance-none w-full h-1 bg-gray-400 rounded-lg outline-none focus:outline-none transition-all duration-100 ease-in-out'
                      />
                      <span className='text-xs'>{formatTime(duration)}</span>
                    </div>

                    <div className={`flex gap-2
                      ${fullscreen ? 'justify-center' : ''}
                      `}>
                      <button onClick={playPrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-8 active:scale-[1.5] duration-200 ease-linear ${ fullscreen ? 'size-16' : '' }`}>
                          <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061Z" />
                        </svg>
                      </button>
                      <button onClick={isPlaying ? pauseSong : playSong}>
                        {isPlaying ? 
                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-8 active:scale-[1.5] duration-200 ease-linear ${ fullscreen ? 'size-16' : '' }`}>
                          <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                        </svg>
                        ) 
                        :
                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-8 active:scale-[1.5] duration-200 ease-linear ${ fullscreen ? 'size-16' : '' }`}>
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                          </svg>)}
                      </button>

                      <button onClick={playNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-8 active:scale-[1.5] duration-200 ease-linear ${ fullscreen ? 'size-16' : '' }`}>
                          <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
                        </svg>
                      </button>
                      {/* <button onClick={togglePlaylist}>Show Playlist</button> */}


                      <div className="controls">
        <button onClick={handleShuffle} className={isShuffle ? 'active' : ''}>
        {isShuffle ? 'Shuffle On' : 'Shuffle Off'}
        </button>
        <button onClick={handleRepeat} className={isRepeat ? 'active' : ''}>
        {isRepeat ? 'Repeat On' : 'Repeat Off'}
        </button>
      </div>
                    </div>
                    <div className='absolute flex right-[2%] bottom-4'>
                      <svg onClick={toggleFullscreen} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-8 active:scale-[1.5] duration-200 ease-linear cursor-pointer ${ fullscreen ? 'hidden' : 'block' }`}>
                        <path fillRule="evenodd" d="M15 3.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V5.56l-3.97 3.97a.75.75 0 1 1-1.06-1.06l3.97-3.97h-2.69a.75.75 0 0 1-.75-.75Zm-12 0A.75.75 0 0 1 3.75 3h4.5a.75.75 0 0 1 0 1.5H5.56l3.97 3.97a.75.75 0 0 1-1.06 1.06L4.5 5.56v2.69a.75.75 0 0 1-1.5 0v-4.5Zm11.47 11.78a.75.75 0 1 1 1.06-1.06l3.97 3.97v-2.69a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h2.69l-3.97-3.97Zm-4.94-1.06a.75.75 0 0 1 0 1.06L5.56 19.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                      </svg>

                      <svg onClick={toggleFullscreen} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`size-8 active:scale-[1.5] duration-200 ease-linear cursor-pointer ${ fullscreen ? 'block' : 'hidden' }`}>
                        <path fillRule="evenodd" d="M3.22 3.22a.75.75 0 0 1 1.06 0l3.97 3.97V4.5a.75.75 0 0 1 1.5 0V9a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1 0-1.5h2.69L3.22 4.28a.75.75 0 0 1 0-1.06Zm17.56 0a.75.75 0 0 1 0 1.06l-3.97 3.97h2.69a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 1.5 0v2.69l3.97-3.97a.75.75 0 0 1 1.06 0ZM3.75 15a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-2.69l-3.97 3.97a.75.75 0 0 1-1.06-1.06l3.97-3.97H4.5a.75.75 0 0 1-.75-.75Zm10.5 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-2.69l3.97 3.97a.75.75 0 1 1-1.06 1.06l-3.97-3.97v2.69a.75.75 0 0 1-1.5 0V15Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                </div>
                
            </div>
              {showPlaylist && (
                <Playlist
                  songs={songs}
                  currentSongIndex={currentSongIndex}
                  setCurrentSongIndex={handleTrackSelection}
                  removeSong={removeSong}
                  // metadata={metadata}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MusicPlayer;
