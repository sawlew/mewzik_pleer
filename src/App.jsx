import { useEffect, useState } from 'react';
import MusicPlayer from './MusicPlayer';
import './App.css';
import About from './About';

function App() {
  const [modal, setModal] = useState(false);
  const [homeScreenHeight, setHomeScreenHeight] = useState(window.innerHeight);

  const modalFunct = () =>{
    setModal(!modal);
  }
  useEffect(() => {
    const updateHeight = () => {
      setHomeScreenHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateHeight);

    setHomeScreenHeight(window.innerHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);
  return (
    <div className="App relative overflow-y-hidden bg-[#450707d1] text-gray-200" style={{ height: homeScreenHeight }}>
      <header className="flex justify-between p-5">
        <h1 className='font-bold text-xl'>Mewzik Pleer</h1>
        <svg onClick={modalFunct} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer active:scale-[1.5]">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </header>
      <MusicPlayer />
      {modal &&
      (<About 
      modal={modal}
      modalFunct={modalFunct}/>)}
    </div>
  );
}

export default App;
