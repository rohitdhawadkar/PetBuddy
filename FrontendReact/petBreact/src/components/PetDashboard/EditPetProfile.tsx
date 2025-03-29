import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import healthService from "../../services/healthService"; // Adjust the import based on your structure

interface PetProfile {
  PetProfile_id: number;
  Profile_pet_id: number;
  pet_name?: string;
  breed?: string;
  age?: number;
  weight?: number;
  medical_condition?: string;
  pet_type?: string;
  // Add any other fields that are relevant
}

const EditPetProfile: React.FC = () => {
  const navigate = useNavigate();
  const [petProfiles, setPetProfiles] = useState<PetProfile[]>([]); // Use the PetProfile interface
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);  // Add loading state
  const [petType, setPetType] = useState<string>("dog");

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

  useEffect(() => {
    const fetchPetProfile = async () => {
      console.log("Fetching pet profile...");
      const selectedPetProfileId = localStorage.getItem("selectedPetProfileId");
      console.log("Selected Pet Profile ID:", selectedPetProfileId);
      
      if (!selectedPetProfileId) {
        console.error("No pet profile ID found in localStorage");
        setError("No pet profile selected.");
        return;
      }
      
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User data:", user);
        
        if (!user.user_id) {
          console.error("No user ID found");
          setError("User not authenticated.");
          return;
        }

        const response = await healthService.getPetProfiles(user.user_id);
        console.log("Pet profiles response:", response);
        
        if (!response || !response.petProfiles) {
          console.error("Invalid response format:", response);
          setError("Failed to fetch pet profiles.");
          return;
        }

        const profile = response.petProfiles.find((p: PetProfile) => p.PetProfile_id === Number(selectedPetProfileId));
        console.log("Found profile:", profile);
        
        if (!profile) {
          console.error("Profile not found for ID:", selectedPetProfileId);
          setError("Pet profile not found.");
          return;
        }

        setPetProfile(profile);
        setPetProfiles(response.petProfiles);
        
        // Set pet type from profile or default to dog
        if (profile.pet_type) {
          setPetType(profile.pet_type);
        }
        
        // Update cache
        localStorage.setItem("cachedPetProfiles", JSON.stringify({
          profiles: response.petProfiles,
          timestamp: new Date().getTime()
        }));
      } catch (err) {
        console.error("Error fetching pet profile:", err);
        setError("Failed to load pet profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetProfile();
  }, []);

  // Loading spinner
  if (isLoading && !petProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-semibold">Error</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If no profile found
  if (!petProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="flex items-center text-yellow-600 dark:text-yellow-400 mb-4">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-semibold">No Profile Found</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">No pet profile data available.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petProfile) return;

    try {
      setIsLoading(true);
      setError(null);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const originalProfile = petProfiles.find(p => p.PetProfile_id === petProfile.PetProfile_id);
      
      const updateData: any = {
        PetProfile_id: petProfile.PetProfile_id,
        Profile_pet_id: petProfile.Profile_pet_id,
        user_id: user.user_id,
        pet_name: petProfile.pet_name !== originalProfile?.pet_name ? petProfile.pet_name : originalProfile?.pet_name,
        breed: petProfile.breed !== originalProfile?.breed ? petProfile.breed : originalProfile?.breed,
        age: petProfile.age !== originalProfile?.age ? petProfile.age : originalProfile?.age,
        weight: petProfile.weight !== originalProfile?.weight ? petProfile.weight : originalProfile?.weight,
        medical_condition: petProfile.medical_condition !== originalProfile?.medical_condition ? 
          petProfile.medical_condition : originalProfile?.medical_condition,
        pet_type: petType
      };

      const response = await healthService.updatePetProfile(updateData);
      if (response) {
        // Update was successful
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update pet profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header with decoration */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="flex items-center">
              <svg className="w-7 h-7 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h1 className="text-2xl font-bold text-white">Edit Pet Profile</h1>
            </div>
            <p className="text-white/80 text-sm mt-1">Update your pet's information and health record</p>
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
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600"
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
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600"
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
                value={petProfile.pet_name || ''}
                onChange={(e) => setPetProfile({ ...petProfile, pet_name: e.target.value })}
                required
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
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
                  value={petProfile.breed || ''}
                  onChange={(e) => setPetProfile({ ...petProfile, breed: e.target.value })}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm appearance-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
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
                  value={petProfile.age || ''}
                  onChange={(e) => setPetProfile({ 
                    ...petProfile, 
                    age: e.target.value ? Number(e.target.value) : undefined 
                  })}
                  required
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
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
                    value={petProfile.weight || ''}
                    onChange={(e) => setPetProfile({ 
                      ...petProfile, 
                      weight: e.target.value ? Number(e.target.value) : undefined 
                    })}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
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
                value={petProfile.medical_condition || ''}
                onChange={(e) => setPetProfile({ ...petProfile, medical_condition: e.target.value })}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="List any medical conditions, allergies, or special needs"
              />
            </div>

            {/* Tips */}
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-emerald-700 dark:text-emerald-200">
              <div className="flex">
                <svg className="h-5 w-5 text-emerald-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Keeping your pet's profile updated helps veterinarians provide the best care possible.</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Profile...
                  </>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPetProfile;
