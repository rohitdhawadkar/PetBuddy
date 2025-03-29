import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import healthService from "../../services/healthService"; // Adjust the import based on your structure

const CreatePetProfile: React.FC = () => {
  const navigate = useNavigate();
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [medicalCondition, setMedicalCondition] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [petType, setPetType] = useState("dog"); // Default to dog

  // Common breeds for selection
  const breedOptions = {
    dog: [
      "Labrador Retriever",
      "German Shepherd",
      "Golden Retriever",
      "French Bulldog",
      "Beagle",
      "Poodle",
      "Rottweiler",
      "Yorkshire Terrier",
      "Boxer",
      "Mixed Breed",
      "Other"
    ],
    cat: [
      "Persian",
      "Maine Coon",
      "Siamese",
      "Ragdoll",
      "Bengal",
      "Sphynx",
      "British Shorthair",
      "Abyssinian",
      "Scottish Fold",
      "Mixed Breed",
      "Other"
    ]
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const newPetProfile = {
        pet_name: petName,
        breed,
        age: Number(age),
        weight: Number(weight),
        medical_condition: medicalCondition,
        pet_type: petType,
        user_id: JSON.parse(localStorage.getItem("user") || "{}").user_id,
      };
      
      await healthService.createPetProfile(newPetProfile);
      navigate("/pet-profiles");
    } catch (err) {
      setError("Failed to create pet profile. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header with decoration */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="flex items-center">
              <svg className="w-7 h-7 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h1 className="text-2xl font-bold text-white">Create Pet Profile</h1>
            </div>
            <p className="text-white/80 text-sm mt-1">Add details about your pet to get started</p>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {error && (
            <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800 flex items-center" role="alert">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pet Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pet Type
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="pet-type-dog"
                    type="radio"
                    name="pet-type"
                    value="dog"
                    checked={petType === "dog"}
                    onChange={() => setPetType("dog")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <label htmlFor="pet-type-dog" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Dog
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="pet-type-cat"
                    type="radio"
                    name="pet-type"
                    value="cat"
                    checked={petType === "cat"}
                    onChange={() => setPetType("cat")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <label htmlFor="pet-type-cat" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Cat
                  </label>
                </div>
              </div>
            </div>

            {/* Pet Name Field */}
            <div>
              <label htmlFor="pet-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pet Name <span className="text-red-500">*</span>
              </label>
              <input
                id="pet-name"
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your pet's name"
              />
            </div>

            {/* Breed Field */}
            <div>
              <label htmlFor="breed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Breed <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <select
                  id="breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm appearance-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="" disabled>Select a breed</option>
                  {breedOptions[petType as keyof typeof breedOptions].map((breedOption) => (
                    <option key={breedOption} value={breedOption}>{breedOption}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Age and Weight Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age (years) <span className="text-red-500">*</span>
                </label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  step="0.1"
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weight (lbs) <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter weight"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">lbs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Condition Field */}
            <div>
              <label htmlFor="medical-condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medical Condition
              </label>
              <textarea
                id="medical-condition"
                value={medicalCondition}
                onChange={(e) => setMedicalCondition(e.target.value)}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="List any medical conditions, allergies, or special needs"
              />
            </div>

            {/* Tips */}
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 text-sm text-blue-700 dark:text-blue-200">
              <div className="flex">
                <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Creating a profile helps track your pet's health metrics and medical history in one place.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/pet-profiles")}
                className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Profile...
                  </>
                ) : (
                  'Create Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePetProfile;
