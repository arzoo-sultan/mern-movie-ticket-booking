import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import BlurCircle from './BlurCircle'
import  {PlayCircleIcon} from 'lucide-react'

const TrailerSection = () => {
 const [currentTrailer,setCurrentTrailer]=useState(dummyTrailers[0])
    return (
    <div className='px-4 sm:px-6 md:px-16 lg:px-24 xl:px-44 py-16 sm:py-20 overflow-hidden'>
        <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>Trailer</p>
        <div className='relative mt-6'>
            <BlurCircle top='-100px' right='-100px'/>
            <div className='relative mx-auto w-full max-w-[960px] aspect-video'>
                <ReactPlayer src={currentTrailer.videoUrl} controls={false} className='absolute inset-0' width='100%' height='100%' />
            </div>
        </div>
        <div className='group grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'>
            {dummyTrailers.map((trailer)=>(
                <div key={trailer.image} className='relative group-hover:not-hover:opacity-50 hover:translate-y-1 duration-300 transition h-28 sm:h-36 md:h-44 lg:h-52 cursor-pointer overflow-hidden rounded-lg' onClick={()=>setCurrentTrailer(trailer)}>
                    <img src={trailer.image}
                    alt="trailer" className='w-full h-full object-cover brightness-75'/>
                    <PlayCircleIcon strokeWidth={1.6} 
                    className='absolute top-1/2 left-1/2 w-6 sm:w-8 h-6 sm:h-8 transform -translate-x-1/2 -translate-y-1/2'/>
                </div>
            ))}
        </div>
       </div>
  )
}

export default TrailerSection