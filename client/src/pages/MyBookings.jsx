import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/TimeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '$'
  const [bookings, setBookings] = useState([])
  const [isLoading, setLoading] = useState(true)
    const { axios,getToken, user, image_base_url } = useAppContext()
   
  const getMyBookings = async () => {
   try {
     const token=await getToken()
     if(!token) return
     const {data}=await axios.get('/api/user/bookings',{
      headers:{Authorization:`Bearer ${token}`}
     })
     if(data.success){
      setBookings(data.bookings);
     }
     
   } catch (error) {
       console.log(error)
   }finally{
    setLoading(false)
   }
  }

  useEffect(() => {
    if(user){
       getMyBookings()
    }
   
  }, [user])

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top='100px' left='100px' />
      <div>
        <BlurCircle bottom='0' left='600px' />
      </div>

      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

      {bookings.map((item, index) => (
        <div
          key={index}
          className='flex flex-col md:flex-row justify-between items-center bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'
        >
          {/* Left: poster + movie info */}
          <div className='flex flex-col md:flex-row w-full md:w-auto'>
            <img
              src={`${image_base_url}${item.show.movie.poster_path}`}
              alt={item.show.movie.title}
              className='w-full md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'
            />
            <div className='flex flex-col p-4 gap-1'>
              <p className='text-lg font-semibold'>{item.show.movie.title}</p>
              <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
              <p className='text-gray-400 text-sm'>
                {dateFormat(item.show.showDateTime)}
              </p>
              <p className='text-gray-400 text-sm'>
                Seats:{' '}
                <span className='text-white font-medium'>
                  {item.bookedSeats.join(', ')}
                </span>
              </p>
            </div>
          </div>

          {/* Right: amount + tickets + pay/paid */}
          <div className='flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-2 px-4 pb-3 md:p-4 shrink-0'>
            <div>
              <p className='text-lg font-bold text-white'>
                {currency}{item.amount}
              </p>
              <p className='text-gray-400 text-sm'>
                Tickets:{' '}
                <span className='text-white font-medium'>
                  {item.bookedSeats.length}
                </span>
              </p>
            </div>


            {item.isPaid ? (
              <span className='text-xs font-semibold px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30'>
                Paid
              </span>
            ) : (
              <button className='bg-primary px-4 py-1.5 text-sm rounded-full font-medium cursor-pointer hover:bg-primary/80 transition-colors'>
                Pay Now
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Loading />
  )
}

export default MyBookings