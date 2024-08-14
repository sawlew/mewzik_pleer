import React, { useState, useEffect } from 'react';

const Playlist = ({ songs, currentSongIndex, setCurrentSongIndex, removeSong }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  

  const filteredSongs = songs
  .map((song, index) => ({ ...song, originalIndex: index }))
  .filter((song) =>
    song.title.toLowerCase().includes(searchQuery) || song.artist.toLowerCase().includes(searchQuery)
  );

  return (
    <div className='max-w-6xl mx-auto p-8'>
       {/* <img src={coverPhoto} alt="" /> */}
      <input
        type="text"
        placeholder="Search songs..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        className='rounded-lg bg-[#750e0e9c] focus:outline focus:outline-[#9c1313]'
      />
      {filteredSongs.length === 0 ? (
        <div className='text-center'>
          <p className='text-center font-bold'>No Results</p>
          <p>Try a new search</p>
        </div>
        
      ) : (
        <div className='playlistArea overflow-y-auto h-[calc(100vh-338px)] pb-16'>
        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {filteredSongs.map((song, index) => (
            <li
              key={index}
              onClick={() => setCurrentSongIndex(song.originalIndex)}
              className={`relative flex items-center p-4 gap-4 transition-all duration-300 rounded-lg cursor-pointer hover:bg-[#9c1313]
                ${ song.originalIndex === currentSongIndex ? 'font-bold bg-[#9c1313]' : 'font-normal bg-[#750e0e9c]' }`}
            >
              <img 
                  src={song.albumArt}
                  alt="Album Art"
                  style={{ width: '64px', height: '64px', borderRadius: '8px' }}
              />
              <div className='whitespace-nowrap truncate'>
                <p className=''>{song.title}</p>
                <p className=''>{song.artist}</p>
              </div>
              { song.originalIndex === currentSongIndex ? '' : 
              
              (
              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  removeSong(song.originalIndex);
                }}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="opacity-40 hover:opacity-100 size-6 absolute right-1 top-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              ) }
              

              {/* <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the song selection
                    removeSong(song.originalIndex);
                  }}
                  className="bg-red-500 text-white p-2 rounded-md"
                >
                  Remove
                </button> */}
            </li>
          ))}
        </ul>
        </div>
      )}
    </div>
  );
};

export default Playlist;
