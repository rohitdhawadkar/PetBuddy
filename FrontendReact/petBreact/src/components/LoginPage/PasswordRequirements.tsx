import * as React from "react";

export const PasswordRequirements: React.FC = () => {
  return (
    <div className="mb-6">
      <p className="text-sm text-gray-600 mb-2">Password requirements:</p>
      <ul className="text-sm text-gray-500 space-y-1">
        <li className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          At least 8 characters
        </li>
        <li className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Contains at least one number
        </li>
        <li className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Contains at least one uppercase letter
        </li>
        <li className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          Contains at least one special character
        </li>
      </ul>
    </div>
  );
};

export default PasswordRequirements; 