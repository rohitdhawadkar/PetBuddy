import React, { useState } from 'react';

interface AddWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (weight: number) => void;
  isLoading?: boolean;
  currentWeight?: number;
}

const AddWeightModal: React.FC<AddWeightModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  isLoading = false,
  currentWeight
}) => {
  const [weight, setWeight] = useState<string>(currentWeight ? currentWeight.toString() : '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate weight
    if (!weight.trim()) {
      setError('Please enter a weight value');
      return;
    }

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Please enter a valid weight value');
      return;
    }

    onSave(weightValue);
    setWeight('');
    setError(null);
    onClose();
  };

  const handleCancel = () => {
    setWeight('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative transform transition-all max-w-lg w-full">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400 rounded-full p-1 z-10 focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all">
          {/* Header with decoration */}
          <div className="bg-gradient-to-r from-green-400 to-teal-500 px-6 py-4 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                <h3 className="text-xl font-bold text-white">
                  {currentWeight ? 'Update Weight' : 'Add New Weight Record'}
                </h3>
              </div>
              <p className="text-white/80 text-sm mt-1">Track your pet's weight to monitor their health</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight (lbs)
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.1"
                  id="weight"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setError(null);
                  }}
                  className={`block w-full px-4 py-3 border ${
                    error ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-lg font-medium`}
                  placeholder="Enter weight in pounds"
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">lbs</span>
                </div>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </p>
              )}
              
              <div className="mt-3 text-gray-500 dark:text-gray-400 text-sm flex items-start">
                <svg className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Regular weight tracking helps detect health issues early. Weigh your pet at the same time of day for consistency.</span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : currentWeight ? (
                  'Update Weight'
                ) : (
                  'Save Weight'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWeightModal; 