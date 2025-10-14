
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaFacebookF, FaTelegramPlane } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#dff6ff] to-[#b8e0ff] overflow-hidden font-poppins text-gray-800">

      {/* Animated SVG wave background */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute top-0 w-full h-[120px] animate-pulse"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="#b3e0ff"
            fillOpacity="1"
            d="M0,224L48,202.7C96,181,192,139,288,122.7C384,107,480,117,576,138.7C672,160,768,192,864,202.7C960,213,1056,203,1152,186.7C1248,171,1344,149,1392,138.7L1440,128L1440,320L0,320Z"
          />
        </svg>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 z-10 relative backdrop-blur-md bg-white/40 rounded-b-lg shadow-sm">
        <Link
          to="/about-us"
          className="text-blue-900 hover:text-blue-700 font-medium transition-colors duration-300"
        >
          About Us
        </Link>
        <nav className="flex gap-6 text-blue-800 text-xl">
          <Link
            to="/login"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-300 font-semibold"
            aria-label="Login"
          >
            <FaSignInAlt />
            Login
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors duration-300 font-semibold"
            aria-label="Register"
          >
            <FaUserPlus />
            Register
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto space-y-12">
        <h1 className="text-6xl font-extrabold text-blue-900 drop-shadow-lg leading-tight">
          👋 Welcome to <br />
          <span className="text-blue-700">ITIL Help Desk System</span>
        </h1>

        <p className="text-xl text-blue-700 max-w-3xl leading-relaxed">
          Get support fast. Stay productive. Easily submit and track your support tickets with our user-friendly Help Desk platform.
        </p>

        <div className="flex gap-8">
          <Link
            to="/register"
            className="px-8 py-4 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-md shadow-lg hover:bg-blue-100 transition-colors duration-300 font-semibold"
          >
            Login
          </Link>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 text-blue-700 text-3xl mt-16">
          <a
            href="https://www.facebook.com/ICTBIBIC/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-800 transition-colors duration-300"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://t.me/yourtelegram"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="hover:text-blue-800 transition-colors duration-300"
          >
            <FaTelegramPlane />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full py-4 text-center text-blue-600 bg-white/30 backdrop-blur-sm select-none">
        &copy; {new Date().getFullYear()} Help Desk System. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
