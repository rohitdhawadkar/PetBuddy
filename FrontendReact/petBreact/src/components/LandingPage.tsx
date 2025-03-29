import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useEffect, useState, useRef } from "react";
import cat from "../assets/cat.jpg";
import paw from "../assets/paw.svg";
import car4 from "../assets/car4.jpg";
import car3 from "../assets/car3.jpg";
import car2 from "../assets/car2.jpg";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Handle smooth scrolling for anchor links
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Testimonial data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Dog Owner",
      content: "PetBuddy has made managing my dog's healthcare so much easier! I love getting medication reminders and keeping all his records in one place.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Michael Chen",
      role: "Cat Owner",
      content: "The appointment scheduling feature has saved me so much time. My vet even commented on how organized I am with my cat's health records!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
      name: "Emma Wilson",
      role: "Multiple Pet Owner",
      content: "With three pets at home, PetBuddy has been a lifesaver. I can manage all their needs in one app and never miss important care dates.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    }
  ];

  // Pet animation for cursor following
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pawPosition, setPawPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  useEffect(() => {
    // Add some easing to the paw movement
    const dx = (mousePosition.x - pawPosition.x) * 0.1;
    const dy = (mousePosition.y - pawPosition.y) * 0.1;
    
    const interval = setInterval(() => {
      setPawPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));
    }, 30);
    
    return () => clearInterval(interval);
  }, [mousePosition, pawPosition]);

  // Automatic testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Floating paw cursor follower */}
      <div 
        className="fixed pointer-events-none z-50 transition-transform duration-100 opacity-70 hidden lg:block"
        style={{ 
          transform: `translate(${pawPosition.x}px, ${pawPosition.y}px) scale(0.5) rotate(${Math.random() * 20 - 10}deg)`,
          left: -20,
          top: -20
        }}
      >
        <img src={paw} alt="" className="w-10 h-10" />
      </div>

      {/* Header */}
      <header className="fixed w-full z-50">
        <nav className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 py-3">
          <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
            <a href="#" className="flex items-center">
              <img className="w-8 h-8 mr-2" src={paw} alt="PetBuddy logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-800 dark:text-white">PetBuddy</span>
            </a>
            
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-2"
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
              
              <button 
                type="button"
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu" 
                aria-expanded="false"
                onClick={() => {
                  const menu = document.getElementById('mobile-menu');
                  if (menu) menu.classList.toggle('hidden');
                }}
              >
                <span className="sr-only">Open main menu</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              <ul className="flex space-x-8">
                <li>
                  <a href="#" className="text-green-600 font-medium hover:text-green-700 dark:text-green-500 dark:hover:text-green-400">Home</a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-gray-700 font-medium hover:text-green-600 dark:text-gray-300 dark:hover:text-green-500">Features</a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-gray-700 font-medium hover:text-green-600 dark:text-gray-300 dark:hover:text-green-500">About</a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-gray-700 font-medium hover:text-green-600 dark:text-gray-300 dark:hover:text-green-500">Contact</a>
                </li>
              </ul>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ml-4"
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
              
              <div className="flex items-center space-x-3 ml-4">
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-900 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>
            
            {/* Mobile menu dropdown */}
            <div className="hidden w-full lg:hidden mt-4" id="mobile-menu">
              <ul className="flex flex-col space-y-3 p-4 mt-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <li>
                  <a href="#" className="block px-3 py-2 text-green-600 rounded bg-gray-100 dark:bg-gray-700 font-medium">Home</a>
                </li>
                <li>
                  <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded font-medium">Features</a>
                </li>
                <li>
                  <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded font-medium">About</a>
                </li>
                <li>
                  <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded font-medium">Contact</a>
                </li>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3">
                  <button
                    onClick={() => navigate('/login')}
                    className="text-gray-900 dark:text-white bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors w-full sm:w-auto"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors w-full sm:w-auto"
                  >
                    Get Started
                  </button>
                </div>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Enhanced with parallax and animation */}
      <section 
        ref={heroRef}
        className="relative bg-white dark:bg-gray-900 pt-16 overflow-hidden"
      >
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url(${cat})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        
        <div className="max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="mr-auto place-self-center lg:col-span-7">
              <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-gray-900 dark:text-white animate-fadeIn">
                <span className="text-green-600 dark:text-green-500">Your Pet's Health,</span> Our Priority
              </h1>
              <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400 animate-slideIn">
                Manage your pet's health records, appointments, and care needs all in one place. Join thousands of pet owners who trust PetBuddy for their pet care needs.
              </p>
              
              {/* Pet care stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-500">15k+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Happy Pet Owners</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-500">98%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-500">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Support Available</div>
                </div>
              </div>
              
              <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-white bg-green-600 rounded-lg sm:w-auto hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-transform hover:scale-105"
                >
                  Get Started
                  <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-300 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 transition-transform hover:scale-105"
                >
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-5 lg:mt-0 lg:flex relative">
              <div className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105">
                <img src={cat} alt="Happy pet with owner" className="w-full h-full object-cover rounded-lg" />
                
                {/* Floating elements */}
                <div className="absolute -right-5 -top-5 bg-green-100 dark:bg-green-900 p-3 rounded-full shadow-lg animate-bounce-slow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                </div>
                
                <div className="absolute left-5 -bottom-3 bg-blue-100 dark:bg-blue-900 p-2 rounded-lg shadow-lg transform rotate-3 animate-pulse-slow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="relative h-16 bg-transparent">
          <svg className="absolute bottom-0 w-full h-16 text-gray-50 dark:text-gray-800" viewBox="0 0 1440 320">
            <path fill="currentColor" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
          {/* Feature 1 */}
          <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
            <div className="text-gray-500 sm:text-lg dark:text-gray-400">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Everything your pet needs in one place</h2>
              <p className="mb-8 font-light lg:text-xl">Manage your pet's health records, schedule appointments, and track medications all in one convenient platform. PetBuddy makes pet care simple and stress-free.</p>
              <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 dark:border-gray-700 my-7">
                <li className="flex space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">Digital Health Records</span>
                </li>
                <li className="flex space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">Easy Appointment Scheduling</span>
                </li>
                <li className="flex space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">Medication Reminders</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img className="hidden w-full rounded-lg lg:mb-0 lg:flex transform transition-all duration-500 hover:scale-105 hover:rotate-1" src={car4} alt="Pet care dashboard" />
              
              {/* Feature highlight indicators */}
              <div className="absolute top-1/4 left-1/4 hidden lg:block">
                <div className="relative">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500">
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold">1</span>
                  </span>
                </div>
              </div>
              
              <div className="absolute top-2/3 right-1/3 hidden lg:block">
                <div className="relative">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500">
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold">2</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
            <div className="order-last lg:order-first relative">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-xl p-6 transform transition-all duration-500 hover:scale-105 hover:rotate-1">
                <img className="w-full rounded-lg" src={car2} alt="Pet health tracking" />
              </div>
              
              {/* Feature tag */}
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg transform rotate-3">
                New Feature!
              </div>
            </div>
            
            <div className="text-gray-500 sm:text-lg dark:text-gray-400">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Smart Health Monitoring</h2>
              <p className="mb-8 font-light lg:text-xl">Track your pet's health metrics over time and receive intelligent insights about their wellness. Set goals and see progress at a glance.</p>
              <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 dark:border-gray-700 my-7">
                <li className="flex space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">Weight & Growth Tracking</span>
                </li>
                <li className="flex space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">Nutrition Management</span>
                </li>
                <li className="flex space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium leading-tight text-gray-900 dark:text-white">Customizable Health Alerts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Testimonials section */}
        <div className="max-w-screen-xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">What Pet Owners Say</h2>
            <div className="w-16 h-1 bg-green-600 mx-auto"></div>
          </div>
          
          <div className="relative">
            {/* Testimonial cards */}
            <div className="flex overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`w-full transition-all duration-500 ease-in-out transform ${
                    index === activeTestimonial 
                      ? 'translate-x-0 opacity-100 scale-100' 
                      : 'translate-x-full absolute opacity-0 scale-95'
                  }`}
                >
                  <div className="bg-white dark:bg-gray-700 rounded-xl shadow-xl p-8 mx-auto max-w-3xl">
                    <div className="flex items-center mb-6">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg italic">"{testimonial.content}"</p>
                    <div className="flex mt-6 space-x-2 justify-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial navigation dots */}
            <div className="flex mt-8 justify-center space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive pet care demo section */}
      <section className="bg-white dark:bg-gray-900 overflow-hidden relative">
        <div className="max-w-screen-xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">See How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
              Our intuitive app makes pet care management simple and effective. Track health records, appointments, and more.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="relative">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-1 rounded-xl shadow-2xl">
                <div className="bg-white dark:bg-gray-900 rounded-lg p-2">
                  <img 
                    src={car3} 
                    alt="App demo" 
                    className="rounded-lg shadow-inner w-full"
                  />
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-5 -right-5 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 1: Register your pets</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Add your pets' details, including breed, age, weight, and any existing health conditions.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 2: Schedule care events</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Set up vet appointments, medication schedules, grooming visits, and other important care events.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Step 3: Get timely reminders</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Receive notifications for upcoming appointments, medication times, and other important pet care events.</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/signup')}
                className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform hover:scale-105"
              >
                Try It Free for 30 Days
              </button>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="relative h-16 bg-transparent">
          <svg className="absolute bottom-0 w-full h-16 text-gray-50 dark:text-gray-800" viewBox="0 0 1440 320">
            <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,154.7C384,128,480,96,576,106.7C672,117,768,171,864,170.7C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        <div className="max-w-screen-xl px-4 py-12 mx-auto text-center lg:py-20 lg:px-6 relative z-10">
          <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-700 rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Ready to give your pet the best care?</h2>
            <p className="mb-8 font-light text-gray-500 dark:text-gray-400 sm:text-xl">Join thousands of pet owners who trust PetBuddy for their pet care needs.</p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              >
                Get Started Today
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 transition-transform hover:scale-105"
              >
                Contact Sales
              </button>
            </div>
          </div>
          
          {/* Floating icons */}
          <div className="absolute top-10 left-10 opacity-25 hidden lg:block">
            <svg className="h-24 w-24 text-green-300 dark:text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor" d="M256 224c-79.41 0-192 122.76-192 200.25 0 34.9 26.81 55.75 71.74 55.75 48.84 0 81.09-25.08 120.26-25.08 39.51 0 71.85 25.08 120.26 25.08 44.93 0 71.74-20.85 71.74-55.75C448 346.76 335.41 224 256 224zm-147.28-12.61c-10.4-34.65-42.44-57.09-71.56-50.13-29.12 6.96-44.29 40.69-33.89 75.34 10.4 34.65 42.44 57.09 71.56 50.13 29.12-6.96 44.29-40.69 33.89-75.34zm84.72-20.78c30.94-8.14 46.42-49.94 34.58-93.36s-46.52-72.01-77.46-63.87-46.42 49.94-34.58 93.36c11.84 43.42 46.53 72.02 77.46 63.87zm281.39-29.34c-29.12-6.96-61.15 15.48-71.56 50.13-10.4 34.65 4.77 68.38 33.89 75.34 29.12 6.96 61.15-15.48 71.56-50.13 10.4-34.65-4.77-68.38-33.89-75.34zm-156.27 29.34c30.94 8.14 65.62-20.45 77.46-63.87 11.84-43.42-3.64-85.21-34.58-93.36s-65.62 20.45-77.46 63.87c-11.84 43.42 3.64 85.22 34.58 93.36z"></path>
            </svg>
          </div>
          <div className="absolute bottom-10 right-10 opacity-25 hidden lg:block">
            <svg className="h-32 w-32 text-blue-300 dark:text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor" d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5 .3-86.2 32.6-96.8c32.4-10.7 70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3 29.1 51.7 10.2 84.1c-18.9 32.4-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52-69.1 84.4-58.5 46.9 53.9 32.6 96.8c-14.3 42.9-52 69.1-84.4 58.5z"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-16 md:p-8 lg:p-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            <div>
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h3>
              <ul className="text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a href="#" className="hover:underline">About</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Careers</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Blog</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Help center</h3>
              <ul className="text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Contact Us</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">FAQ</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Support</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h3>
              <ul className="text-gray-500 dark:text-gray-400">
                <li className="mb-4">
                  <a href="#" className="hover:underline">Privacy Policy</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Terms of Service</a>
                </li>
                <li className="mb-4">
                  <a href="#" className="hover:underline">Cookie Policy</a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Connect with us</h3>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Subscribe to our newsletter</h4>
                <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" 
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <img className="w-8 h-8 mr-2" src={paw} alt="PetBuddy logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-800 dark:text-white">PetBuddy</span>
            </div>
            <span className="text-sm text-center md:text-left text-gray-500 dark:text-gray-400">© 2024 PetBuddy™. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;

/* Add necessary styles for animations */
<style>{`
  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(-10%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 3s infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .animate-fadeIn {
    animation: fadeIn 1s ease-in;
  }
  
  .animate-slideIn {
    animation: slideIn 1s ease-out;
  }
`}</style> 