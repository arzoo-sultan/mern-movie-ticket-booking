import { useContext, useEffect, useState, createContext } from "react";
import axios from 'axios';
import { useAuth, useUser } from "@clerk/react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const image_base_url= import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
     
    
    const [isAdminLoading, setIsAdminLoading] = useState(true); // Added: Tracks network status
    const [shows, setShows] = useState([]);
    const [favouriteMovies, setFavouriteMovies] = useState([]);
    
    const { user } = useUser();
    const { getToken } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const fetchIsAdmin = async () => {
        try {
            setIsAdminLoading(true); // Start loading when checking status
            const token = await getToken();
            // console.log("TOKEN:", token);
            const { data } = await axios.get('/api/admin/is-admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("ADMIN RESPONSE:", data);
            setIsAdmin(data.isAdmin);
            
            if (!data.isAdmin && pathname.startsWith('/admin')) {
                navigate('/');
                toast.error('You are not Authorized to access admin dashboard');
            }
        } catch (error) {
            console.error("Error checking admin status:", error);
            setIsAdmin(false); // Fallback to safe state on error
        } finally {
            setIsAdminLoading(false); // Stop loading regardless of outcome
        }
    };

    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all');
            if (data.success) {
                setShows(data.fetchShows);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching shows:", error);
        }
    }; 

    const fetchFavouriteMovies = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user/favourites', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (data.success) {
                setFavouriteMovies(data.movies);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error while Fetching Favourites", error);
        }
    };

    useEffect(() => {
        fetchShows();
    }, []);

   useEffect(() => {
    if (user) {
        fetchIsAdmin();
        fetchFavouriteMovies();
    } else if (user === null) {
        // user===null means Clerk finished loading and confirmed no user
        // user===undefined means Clerk is still initializing
        setIsAdmin(false);
        setIsAdminLoading(false);
    }
    // Do NOT handle undefined — keep showing loading spinner
}, [user]);
    const value = { 
        navigate,
        fetchFavouriteMovies,
        axios, 
        isAdmin, 
        isAdminLoading, // Added to context distribution values
        shows, 
        favouriteMovies, 
        fetchShows,
        user,
        getToken,
        image_base_url
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);