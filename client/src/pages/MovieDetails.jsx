import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import { HeartIcon, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/TimeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const MovieDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { axios, shows, getToken, user, fetchFavouriteMovies, favouriteMovies, image_base_url } = useAppContext()

  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)

  // ── Fetch real show data from backend ────────────────────────────
  const fetchShow = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success) {
        setShow(data) // { movie, dateTime }
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching show:', error)
      toast.error('Failed to load movie details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchShow()
  }, [id])

  // ── Toggle favourite ─────────────────────────────────────────────
  const isFavourite = favouriteMovies?.some(m => String(m._id) === String(id))

  const toggleFavourite = async () => {
    if (!user) return toast.error('Please sign in to add favourites.')
    try {
      const token = await getToken()
      const { data } = await axios.post(
        '/api/user/update-favourites',
        { movieId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        fetchFavouriteMovies()
        toast.success(isFavourite ? 'Removed from favourites' : 'Added to favourites')
      }
    } catch (error) {
      toast.error('Failed to update favourites.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (!show?.movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-3">Movie Not Found</h2>
        <p className="text-gray-400 mt-2 max-w-md">
          The movie you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate('/movies')}
          className="mt-6 px-8 py-3 bg-primary hover:bg-primary-dull rounded-lg font-medium transition"
        >
          Browse Movies
        </button>
      </div>
    )
  }

  const movie = show.movie

  return (
    <>
    <div className="pt-30 md:pt-40 pb-20">

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Poster */}
          <img
            src={`${image_base_url}${movie.poster_path}`}  // ✅ fixed
            alt={movie.title}
            className="max-md:mx-auto rounded-xl h-[420px] w-[280px] object-cover"
          />

          {/* Content */}
          <div className="relative flex flex-col gap-4">
            <BlurCircle top="-100px" left="-100px" />

            <p className="text-primary uppercase tracking-wide">
              {movie.original_language?.toUpperCase() || 'English'}
            </p>

            <h1 className="text-4xl font-bold max-w-xl">{movie.title}</h1>

            <div className="flex items-center gap-2 text-gray-300">
              <StarIcon className="w-5 h-5 fill-primary text-primary" />
              <span>{movie.vote_average?.toFixed(1)} User Rating</span>
            </div>

            <p className="text-gray-400 leading-relaxed max-w-2xl">{movie.overview}</p>

            <p className="text-gray-300">
              {timeFormat(movie.runtime)} •{' '}
              {movie.genres?.map(g => g.name).join(', ')} •{' '}
              {movie.release_date?.split('-')[0]}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-700 rounded-md transition">
                <PlayCircleIcon className="w-5 h-5" />
                Watch Trailer
              </button>

                <a
                href="#dateSelect"
                className="px-8 py-3 text-sm bg-primary hover:bg-primary-dull rounded-md transition font-medium"
              >
                Buy Tickets
              </a>

              <button
                onClick={toggleFavourite}
                className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full transition"
              >
                <HeartIcon className={`w-5 h-5 ${isFavourite ? 'fill-primary text-primary' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-20">Your Favourite Cast</h2>
      </div>

      //{/* Cast Carousel */}
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex gap-5 w-max px-6 md:px-10 lg:px-16">
          {movie.casts?.slice(0, 12).map((cast, index) => (
            <div
              key={cast.id || cast.name || index}
              className="flex flex-col items-center text-center flex-shrink-0"
            >
              <img
                src={cast.profile_path ? `${image_base_url}${cast.profile_path}` : '/placeholder.png'} // ✅ fixed
                alt={cast.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="text-sm font-medium mt-3 max-w-[90px]">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-16">

        <DateSelect dateTime={show.dateTime} id={id} />

        <h2 className="text-xl font-semibold mt-20 mb-8">You May Also Like</h2>

        <div className="flex flex-wrap gap-8 max-sm:justify-center">
          {(shows || [])
            .filter(item => String(item._id) !== String(id))
            .slice(0, 4)
            .map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
        </div>

        <div className="flex justify-center mt-20">
          <button
            onClick={() => { navigate('/movies'); window.scrollTo(0, 0) }}
            className="px-10 py-3 bg-primary hover:bg-primary-dull rounded-md font-medium transition"
          >
            Show More
          </button>
        </div>

      </div>
    </div>
    </>
  )
}

export default MovieDetails