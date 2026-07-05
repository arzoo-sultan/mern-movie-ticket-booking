import { ArrowRight, Calendar1Icon, ClockIcon } from 'lucide-react'
import React from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
const HeroSection = () => {
    const navigate=useNavigate();
  return (
    <div className='flex flex-col items-start justify-center gap-3 sm:gap-4 px-5 sm:px-8 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center min-h-screen pt-24 pb-16' >
        <img src={assets.marvelLogo} alt="Marvel Logo" className='max-h-10 sm:max-h-11 lg:h-11 mt-4 sm:mt-8 lg:mt-20'/>
         <h1 className='text-4xl sm:text-5xl md:text-[70px] md:leading-[4.5rem] font-semibold leading-tight'>Guardians <br/>of the Galaxy </h1>
         <div className='flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-300'>
            <span>Action|Adventure|Sci-Fic</span>
            <div className='flex items-center gap-1'>
                <Calendar1Icon className='w-4 h-4 sm:w-4.5 sm:h-4.5 '/> 2018
            </div>
            <div className='flex items-center gap-1'>
                <ClockIcon className='w-4 h-4 sm:w-4.5 sm:h-4.5 '/> 2h 8m
            </div>
         </div>
         <p className='max-w-md text-sm sm:text-base text-gray-300'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum itaque repudiandae modi soluta ducimus eaque maxime? Alias, dignissimos earum animi ullam voluptate est! Accusantium a tenetur dolor soluta, assumenda repudiandae!</p>
         <button  onClick={()=>navigate('/movies')} className='flex items-center gap-1 px-5 sm:px-6 py-3 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer w-fit'>Explore Movies
            <ArrowRight className='w-5 h-5'/>
         </button>
    </div> 
  )
}

export default HeroSection