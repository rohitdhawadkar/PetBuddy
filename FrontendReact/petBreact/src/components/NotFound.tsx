import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useState, useEffect } from "react";
import paw from "../assets/paw.svg";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isVisible, setIsVisible] = useState(false);
  const [pawElements, setPawElements] = useState<JSX.Element[]>([]);

  // Generate random paw prints effect
  useEffect(() => {
    const generatePaws = () => {
      const pawsArray: JSX.Element[] = [];
      for (let i = 0; i < 8; i++) {
        const xPos = Math.random() * 90 + 5; // 5% to 95% of container width
        const yPos = Math.random() * 90 + 5; // 5% to 95% of container height
        const rotation = Math.random() * 360; // Random rotation
        const scale = 0.5 + Math.random() * 0.5;
        
        pawsArray.push(
          <div 
            key={i}
            className="absolute opacity-5 dark:opacity-10 animate-fadeIn"
            style={{
              left: `${xPos}%`,
              top: `${yPos}%`,
              transform: `rotate(${rotation}deg) scale(${scale})`,
            }}
          >
            <img src={paw} alt="" className="w-16 h-16" />
          </div>
        );
      }
      return pawsArray;
    };
    
    setPawElements(generatePaws());
    
    // Animate entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen relative overflow-hidden">
      {/* Background paw prints */}
      {pawElements}

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">
        <div className="flex justify-between items-center w-full sm:max-w-md mb-6">
          <a href="#" className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white group" onClick={(e) => {e.preventDefault(); navigate('/');}}>
            <div className="relative overflow-hidden rounded-full mr-2 group-hover:shadow-lg transition-all duration-300">
              <img className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" src={paw} alt="PetBuddy logo" />
            </div>
            <span className="relative transition-all duration-300 group-hover:pl-1">PetBuddy</span>
          </a>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className={`w-full bg-white rounded-2xl shadow-xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 overflow-hidden transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-center relative">
            {/* Animated 404 element with gradient background */}
            <div className="relative mx-auto">
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-500 dark:from-green-400 dark:to-blue-600 rounded-full flex items-center justify-center mb-8 mx-auto shadow-lg transform transition-transform hover:scale-110 hover:rotate-3 cursor-pointer animate-float" onClick={() => navigate('/')}>
                <span className="text-white text-4xl font-bold">404</span>
              </div>
              
              {/* Paw print indicator */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                <svg className="w-8 h-8 text-gray-300 dark:text-gray-600 animate-bounce-slow" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5.3-86.2 32.6-96.8c32.4-10.7 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7.9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5z"></path>
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white">
              Oops! Page Not Found
            </h1>
            <p className="text-lg font-light text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Looks like this page has wandered off like a curious pet. Let's get you back on track.
            </p>
            
            <div className="flex flex-col space-y-3 pt-2">
              <button
                onClick={() => navigate('/')}
                className="w-full text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:focus:ring-green-800 transform transition-transform hover:scale-105 shadow-md"
              >
                Go Back Home
              </button>
              
              <button
                onClick={() => navigate(-1)}
                className="w-full text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 transition-all border border-transparent hover:border-gray-300 dark:hover:border-gray-500"
              >
                Return to Previous Page
              </button>
            </div>
            
            <div className="flex justify-center items-center space-x-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" onClick={(e) => {e.preventDefault(); navigate('/contact');}} className="hover:text-green-600 dark:hover:text-green-400 hover:underline">Contact Support</a>
              <span>•</span>
              <a href="#" onClick={(e) => {e.preventDefault(); navigate('/faq');}} className="hover:text-green-600 dark:hover:text-green-400 hover:underline">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound; 