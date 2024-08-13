import React from 'react'

const About = ({modal, modalFunct}) => {
  return (

    <div className='absolute h-full w-full top-0 flex justify-center items-center bg-[#750e0e9c] backdrop-blur-md'>
        <svg onClick={modalFunct} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer absolute top-[20px] right-[20px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <div className='w-[90%] sm:w-1/2 p-5 border-4 bg-[#000000a6] text-center border-[#9c1313] rounded-lg font-mono'>
            <h1>Thank you for checking out Mewzik Pleer 🥰🥰🥰!!!</h1>
            <br />
            <p>Mewzik Pleer is a project built using <strong>React</strong> and <strong>TailwindCSS</strong>. The user interface design was inspired by various online sources, blending modern aesthetics with functional elements to create an intuitive and visually appealing experience.</p>
            <br />
            <p>I'm a message away if you want to collaborate with me on a project or you want me to add some features to this app🤝.</p>
            <br />
            <div className='flex justify-center gap-4'>
                <a  href="https://github.com/sawlew" target="_blank"><ion-icon name="logo-github"
                        class="text-white hover:scale-[1.5] duration-200 ease-linear text-3xl"></ion-icon></a>
                <a  href="https://twitter.com/sawlew" target="_blank"><ion-icon name="logo-twitter"
                        class="text-white hover:scale-[1.5] duration-200 ease-linear text-3xl"></ion-icon></a>
                <a  href="https://www.linkedin.com/in/sawlew/" target="_blank"><ion-icon name="logo-linkedin"
                        class="text-white hover:scale-[1.5] duration-200 ease-linear text-3xl"></ion-icon></a>
                <a  href="mailto: sawlew@gmail.com" target="_blank"><ion-icon name="mail"
                        class="text-white hover:scale-[1.5] duration-200 ease-linear text-3xl"></ion-icon></a>
            </div>
        </div>
    </div>
  )
}

export default About