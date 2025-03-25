import * as React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex justify-center items-center p-6 bg-gradient-to-br from-green-50 to-green-100 min-h-screen max-md:p-5 max-sm:p-4">
      <section className="p-12 bg-white rounded-3xl border border-neutral-200 w-[673px] max-md:p-8 max-md:w-[90%] max-sm:p-6 max-sm:w-full shadow-lg text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
            <span className="text-white text-4xl font-bold">404</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 max-md:text-3xl max-sm:text-3xl mb-4">
            Page Not Found
          </h1>
          <p className="text-base text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-xl font-semibold text-white bg-green-500 hover:bg-green-600 transition-all duration-200 px-8 py-3 rounded-full shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          Go Back Home
        </button>
      </section>
    </main>
  );
};

export default NotFound; 