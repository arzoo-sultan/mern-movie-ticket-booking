import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SignIn, useUser } from '@clerk/react'
import { useAppContext } from "./context/AppContext";
import Loading from "./components/Loading";
// User Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favourites from "./pages/Favourites";

// Admin Components
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import ListBookings from "./pages/admin/ListBookings";
import ListShows from "./pages/admin/ListShows";
import AddShows from "./pages/admin/AddShows";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");

  const { isLoaded, isSignedIn } = useUser();
  const { isAdmin, isAdminLoading } = useAppContext();

  // Wait until Clerk and admin status are loaded
 if (!isLoaded || isAdminLoading) {
  return (
    <div className="min-h-screen flex justify-center items-center">
     <Loading/>
    </div>
  );
}
     
console.log({
  isLoaded,
  isSignedIn,
  isAdmin,
  isAdminLoading,
});
  return (
    <>
      <Toaster />

      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/seats" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favourites" element={<Favourites />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            !isSignedIn ? (
              <div className="min-h-screen flex justify-center items-center">
                <SignIn fallbackRedirectUrl="/admin" />
              </div>
            ) : !isAdmin ? (
              <Navigate to="/" replace />
            ) : (
              <Layout />
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;