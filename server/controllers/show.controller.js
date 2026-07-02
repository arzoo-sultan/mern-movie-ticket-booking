import axios from "axios";
import Movie from "../models/movie.model.js";
import Show from "../models/show.model.js";

// Get Now Playing Movies
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    res.json({
      success: true,
      movies: data.results,
    });
  } catch (error) {
    console.error("Error in getNowPlayingMovies:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Show
export const addShow = async (req, res) => {
  try {
    const { movieId, title, shows } = req.body; // ← destructure title

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "movieId is required.",
      });
    }

    // Check if movie already exists in our database
    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch movie details and credits simultaneously
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      // Save movie in MongoDB
      movie = await Movie.create({
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      });
    }

    // Resolve title: frontend title → DB movie title → fallback
    const resolvedTitle = title || movie.title || "Unknown Title";

    // Frontend sends: shows = [{ dateTime: "2026-06-30T14:00", price: 500 }, ...]
    const validShows = Array.isArray(shows) ? shows : [];

    const showsToCreate = validShows
      .filter((s) => {
        const validDate = s?.dateTime && !isNaN(new Date(s.dateTime).getTime());
        const validPrice = s?.price !== undefined && Number(s.price) > 0;
        return validDate && validPrice;
      })
      .map((s) => ({
        movie: movieId,
        title: resolvedTitle,           // ← save title on each show
        showDateTime: new Date(s.dateTime),
        showPrice: Number(s.price),
        occupiedSeats: {},
      }));

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);

      return res.json({
        success: true,
        message: "Show(s) added successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message:
          "No shows were added. Please provide a valid 'shows' array with dateTime and price.",
      });
    }
  } catch (error) {
    console.error("Error in addShow:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Api to get AllShows from database
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // filter unique Shows
    const uniqueShows = new Set(shows.map((show) => show.movie));

    res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error("Error in getShows:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Api to get a Single show from Api
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    }).sort({ showDateTime: 1 });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];

      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error("Error in getShow:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};