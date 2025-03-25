"use client";
import * as React from "react";
import FormInput from "./FormInput";
import PasswordRequirements from "./PasswordRequirements";
import { useNavigate } from "react-router-dom";

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <main className="flex justify-center items-center p-6 bg-gradient-to-br from-green-50 to-green-100 min-h-screen max-md:p-5 max-sm:p-4">
      <section className="p-12 bg-white rounded-3xl border border-neutral-200 w-[673px] max-md:p-8 max-md:w-[90%] max-sm:p-6 max-sm:w-full shadow-lg">
        <div className="flex flex-col items-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">PB</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 max-md:text-3xl max-sm:text-3xl text-center">
              Welcome to PetBuddy
            </h1>
            <p className="text-base text-gray-600 text-center mt-2">
              Create an account to view and track your attendance
            </p>
          </div>

          {/* Social Login */}
          <div className="w-full max-w-[591px] mb-8">
            <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-full py-3 px-6 text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-[591px]">
            <FormInput label="Username" type="text" />
            <FormInput label="Email" type="email" />
            <FormInput label="Password" type="password" />

            <PasswordRequirements />

            <button
              type="submit"
              className="mb-6 w-full text-xl font-semibold text-white bg-green-500 hover:bg-green-600 transition-all duration-200 h-[54px] rounded-full shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Create Account
            </button>

            <p className="text-sm text-center text-gray-600">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">Privacy Policy</a>
            </p>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate('/login')}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUpForm; 