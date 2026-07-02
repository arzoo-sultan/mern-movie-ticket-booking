import React, { useEffect, useRef, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { StarIcon, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react'
import { kconverter } from '../../lib/Kconverter';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY
    const{axios,getToken,user,image_base_url}=useAppContext();
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError]     = useState(null);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice]         = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]); // list of { id, dateTime, price }
  const [submitLoading, setSubmitLoading] = useState(false);
  const [addingShow,setAddingShow]=useState(false)
  // ── Drag-to-scroll ──────────────────────────────────────────────
  const scrollRef  = useRef(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  // ── Fetch movies ─────────────────────────────────────────────────
  const fetchNowPlayingMovies = async () => {
    setFetchLoading(true);
    setFetchError(null);
    try {
      // ── BACKEND SWAP ──
       const { data } = await axios.get('/api/show/now-playing',{headers:{
            Authorization:`Bearer ${await getToken()}`
       }});
       
      // setNowPlayingMovies(data.movies);
      setNowPlayingMovies(data.movies); 
    } catch (err) {
      setFetchError('Failed to load movies. Please try again.');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if(user)
    fetchNowPlayingMovies();
  }, [user]);

  // Reset selected times when movie changes
  useEffect(() => {
    setSelectedTimes([]);
    setDateTimeInput('');
    setShowPrice('');
  }, [selectedMovie?.id]);

  // ── Add time slot to list ─────────────────────────────────────────
  const handleAddTimeSlot = () => {
    if (!dateTimeInput) {
      toast.error('Please select a date & time.');
      return;
    }
    if (!showPrice || Number(showPrice) <= 0) {
      toast.error('Please enter a valid ticket price.');
      return;
    }
    // Prevent duplicate times
    const duplicate = selectedTimes.find(t => t.dateTime === dateTimeInput);
    if (duplicate) {
      toast.error('This time slot is already added.');
      return;
    }

    setSelectedTimes(prev => [
      ...prev,
      { id: Date.now(), dateTime: dateTimeInput, price: Number(showPrice) }
    ]);
    setDateTimeInput('');
    setShowPrice('');
  };

  // ── Remove a time slot ────────────────────────────────────────────
  const handleRemoveTimeSlot = (id) => {
    setSelectedTimes(prev => prev.filter(t => t.id !== id));
  };

  // ── Final submit — send all time slots ────────────────────────────
  const handleAddShow = async () => {
    if (!selectedMovie) {
      toast.error('Please select a movie first.');
      return;
    }
    if (selectedTimes.length === 0) {
      toast.error('Please add at least one show time.');
      return;
    }

    const payload = {
      movieId: selectedMovie.id,
      title:   selectedMovie.title,
      shows:   selectedTimes.map(t => ({ dateTime: t.dateTime, price: t.price })),
    };

    setSubmitLoading(true);
    try {
      // ── BACKEND SWAP ──
      const {data}=await  axios.post('api/show/add',payload,{headers:{
            Authorization:`Bearer ${await getToken()}`}})
      
      //console.log('Ready to send to backend:', payload); // ← remove when backend is ready
      if(data.success)
      toast.success(`${selectedTimes.length} show(s) added for "${selectedMovie.title}"!`);

      setSelectedMovie(null);
      setSelectedTimes([]);
      
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add shows. Try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Drag scroll handlers ─────────────────────────────────────────
  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = 'grabbing';
  };
  const onMouseLeave = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const scrollByAmount = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  // ── Format datetime for display ───────────────────────────────────
  const formatDateTime = (dt) => {
    const d = new Date(dt);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // ── Render states ────────────────────────────────────────────────
  if (fetchLoading) return <Loading />;

  if (fetchError) return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <p className="text-red-400 text-sm">{fetchError}</p>
      <button onClick={fetchNowPlayingMovies} className="px-4 py-2 bg-white/10 hover:bg-white/20 transition rounded-lg text-sm">
        Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Title text1='Add' text2={"Shows"} />

      {/* Section header */}
      <div className="flex items-center justify-between mt-10 mb-4">
        <div>
          <p className="text-lg font-semibold text-white tracking-wide">Now Playing</p>
          <p className="text-xs text-gray-500 mt-0.5">{nowPlayingMovies.length} movies available</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scrollByAmount(-1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-gray-300 hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scrollByAmount(1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-gray-300 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable movie row */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="overflow-x-auto py-3 select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab', scrollBehavior: 'smooth' }}
      >
        <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
        <div className="flex gap-4 w-max">
          {nowPlayingMovies.map((movie) => {
            const isSelected = selectedMovie?.id === movie.id;
            return (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(isSelected ? null : movie)}
                className={`relative w-40 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-out
                  ${isSelected
                    ? 'ring-2 ring-red-500 scale-[1.03] shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                    : 'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/60'
                  }`}
              >
                <img src={`${image_base_url}${movie.poster_path}`} alt={movie.title || 'Movie Poster'} className="w-full h-56 object-cover brightness-90 transition duration-300" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5 pt-6">
                  <p className="text-white text-xs font-semibold leading-tight truncate mb-1.5">{movie.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-yellow-400 text-[11px] font-bold">
                      <StarIcon className="w-3 h-3 fill-yellow-400" />
                      {movie.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-[10px]">{kconverter(movie.vote_count)} votes</span>
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Selected</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduling panel */}
      {selectedMovie && (
        <div className="mt-8 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-lg">
          <div className="flex items-start gap-4">
            <img src={`${image_base_url}${selectedMovie.poster_path}`} alt={selectedMovie.title} className="w-16 h-24 object-cover rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-base leading-snug">{selectedMovie.title}</h3>
              <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                <StarIcon className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                {selectedMovie.vote_average?.toFixed(1)} · {selectedMovie.vote_count?.toLocaleString()} votes
              </p>

              {/* Input row */}
              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Show Date & Time</label>
                  <input
                    type="datetime-local"
                    value={dateTimeInput}
                    onChange={e => setDateTimeInput(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Ticket Price ({currency})</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    value={showPrice}
                    min={1}
                    onChange={e => setShowPrice(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-600"
                  />
                </div>

                {/* Add time slot button */}
                <button
                  onClick={handleAddTimeSlot}
                  className="w-full border border-dashed border-white/20 hover:border-primary hover:bg-primary/10 transition text-gray-400 hover:text-primary text-sm py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Add Time Slot
                </button>
              </div>

              {/* Selected time slots list */}
              {selectedTimes.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-500 text-xs mb-2">{selectedTimes.length} slot{selectedTimes.length > 1 ? 's' : ''} added</p>
                  <div className="flex flex-col gap-2">
                    {selectedTimes.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-white text-xs font-medium">{formatDateTime(slot.dateTime)}</p>
                            <p className="text-gray-500 text-[10px]">{currency} {slot.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveTimeSlot(slot.id)}
                          className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition flex items-center justify-center text-gray-500 flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final submit */}
              <button
                onClick={handleAddShow}
                disabled={submitLoading || selectedTimes.length === 0}
                className="mt-4 w-full bg-primary hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition text-white text-sm font-semibold py-2 rounded-lg"
              >
                {submitLoading ? 'Adding...' : `Add ${selectedTimes.length > 0 ? selectedTimes.length : ''} Show${selectedTimes.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddShows;