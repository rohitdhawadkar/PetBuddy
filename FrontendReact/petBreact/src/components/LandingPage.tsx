import * as React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed w-full">
        <nav className="bg-white border-gray-200 py-2.5">
          <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
            <a href="#" className="flex items-center">
              <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-800">PetBuddy</span>
            </a>
            <div className="flex items-center lg:order-2">
              <button
                onClick={() => navigate('/login')}
                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 focus:outline-none"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none"
              >
                Get Started
              </button>
            </div>
            <div className="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1">
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <a href="#" className="block py-2 pl-3 pr-4 text-green-600 rounded lg:bg-transparent lg:text-green-600 lg:p-0">Home</a>
                </li>
                <li>
                  <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-green-600 lg:p-0">Services</a>
                </li>
                <li>
                  <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-green-600 lg:p-0">About</a>
                </li>
                <li>
                  <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-green-600 lg:p-0">Contact</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-gray-900">
              Your Pet's Health, Our Priority
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">
              Manage your pet's health records, appointments, and care needs all in one place. Join thousands of pet owners who trust PetBuddy for their pet care needs.
            </p>
            <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-white bg-green-600 rounded-lg sm:w-auto hover:bg-green-700 focus:ring-4 focus:ring-green-300"
              >
                Get Started
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-center text-gray-900 border border-gray-300 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="/images/hero-pet.png" alt="Happy pet with owner" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50">
        <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
          <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
            <div className="text-gray-500 sm:text-lg">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900">Everything your pet needs in one place</h2>
              <p className="mb-8 font-light lg:text-xl">Manage your pet's health records, schedule appointments, and track medications all in one convenient platform. PetBuddy makes pet care simple and stress-free.</p>
              <ul role="list" className="pt-8 space-y-5 border-t border-gray-200 my-7">
                <li className="flex space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium leading-tight text-gray-900">Digital Health Records</span>
                </li>
                <li className="flex space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium leading-tight text-gray-900">Easy Appointment Scheduling</span>
                </li>
                <li className="flex space-x-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-base font-medium leading-tight text-gray-900">Medication Reminders</span>
                </li>
              </ul>
            </div>
            <img className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex" src="/images/feature-1.png" alt="Pet care dashboard" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white">
        <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-24 lg:px-6">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900">Ready to give your pet the best care?</h2>
          <p className="mb-8 font-light text-gray-500 sm:text-xl">Join thousands of pet owners who trust PetBuddy for their pet care needs.</p>
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300"
          >
            Get Started Today
            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-screen-xl p-4 py-6 mx-auto lg:py-16 md:p-8 lg:p-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
            <div>
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Company</h3>
              <ul className="text-gray-500">
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
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Help center</h3>
              <ul className="text-gray-500">
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
              <h3 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Legal</h3>
              <ul className="text-gray-500">
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
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="text-center">
            <span className="block text-sm text-center text-gray-500">© 2024 PetBuddy™. All Rights Reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage; 