import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { MenuIcon, Ticket, XIcon } from 'lucide-react';
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();

  const closeMenu = () => setIsOpen(false);
   const {favouriteMovies}=useAppContext()
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-3 sm:px-6 md:px-10 lg:px-16 py-4 sm:py-5 text-white bg-black/40 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="z-50 flex-shrink-0">
          <img src={assets.logo} alt="QuickShow" className="w-28 sm:w-32 md:w-36" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 px-6 lg:px-8 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
          <Link to="/" className="hover:text-primary transition-colors duration-200">Home</Link>
          <Link to="/movies" className="hover:text-primary transition-colors duration-200">Movies</Link>
          <Link to="/theaters" className="hover:text-primary transition-colors duration-200">Theaters</Link>
          <Link to="/releases" className="hover:text-primary transition-colors duration-200">Releases</Link>
          {favouriteMovies.length > 0 && <Link to="/favourites" className="hover:text-primary transition-colors duration-200">Favourites</Link>}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 z-50 flex-shrink-0">

          {/* Search icon removed because it was not functional */}

          {isSignedIn ? (
            // ── UserButton with My Bookings injected into the dropdown ──
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 sm:w-10 sm:h-10',
                },
              }}
            >
              <UserButton.MenuItems>
                {/* My Bookings sits right below "Manage account" */}
                <UserButton.Link
                  label="My Bookings"
                  labelIcon={<Ticket className="w-4 h-4" />}
                  href="/my-bookings"
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-primary hover:bg-primary-dull rounded-full font-semibold transition">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="hidden md:block px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base border border-primary text-primary hover:bg-primary/10 rounded-full font-semibold transition">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}

          {/* Hamburger — hidden while sidebar is open to prevent icon overlap */}
          {!isOpen && (
            <MenuIcon
              onClick={() => setIsOpen(true)}
              className="md:hidden w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:text-primary transition"
            />
          )}
        </div>

        {/* ── Backdrop (click outside to close) ── */}
        {isOpen && (
          <div
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            aria-hidden="true"
          />
        )}

        {/* ── Mobile Sidebar ── */}
        <div
          className={`
            fixed top-0 right-0 h-screen w-[75%] max-w-xs sm:max-w-sm
            bg-black/95 backdrop-blur-xl z-50
            flex flex-col pt-20 px-6 sm:px-8
            text-base sm:text-lg font-medium
            transition-transform duration-300 ease-in-out
            md:hidden
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* X icon — top-right of the sidebar panel */}
          <XIcon
            onClick={closeMenu}
            className="absolute top-5 right-6 w-5 h-5 sm:w-6 sm:h-6 cursor-pointer hover:text-primary transition"
          />

          <Link to="/" onClick={closeMenu} className="py-3 sm:py-4 border-b border-white/10 hover:text-primary transition">
            Home
          </Link>
          <Link to="/movies" onClick={closeMenu} className="py-3 sm:py-4 border-b border-white/10 hover:text-primary transition">
            Movies
          </Link>
          <Link to="/theaters" onClick={closeMenu} className="py-3 sm:py-4 border-b border-white/10 hover:text-primary transition">
            Theaters
          </Link>
          <Link to="/releases" onClick={closeMenu} className="py-3 sm:py-4 border-b border-white/10 hover:text-primary transition">
            Releases
          </Link>
          <Link to="/favourites" onClick={closeMenu} className="py-3 sm:py-4 border-b border-white/10 hover:text-primary transition">
            Favourites
          </Link>

          {/* Search button removed from mobile sidebar because it was not functional */}

          {/* My Bookings link inside sidebar (visible when signed in) */}
          {isSignedIn && (
            <Link
              to="/my-bookings"
              onClick={closeMenu}
              className="flex items-center gap-3 py-3 sm:py-4 border-b border-white/10 hover:text-primary transition"
            >
              <Ticket className="w-5 h-5" />
              My Bookings
            </Link>
          )}

          {!isSignedIn && (
            <div className="mt-6 sm:mt-8">
              <SignUpButton mode="modal">
                <button className="w-full py-3 border border-primary text-primary rounded-full font-semibold hover:bg-primary/10 transition">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;