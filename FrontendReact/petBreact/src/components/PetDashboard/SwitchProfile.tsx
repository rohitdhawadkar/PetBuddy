// FrontendReact/petBreact/src/components/PetDashboard/SwitchProfile.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import healthService from "../../services/healthService"; // Adjust the import based on your structure

interface PetProfile {
  Profile_pet_id: number;
  PetProfile_id?: number;
  pet_name: string;
  breed: string;
  age?: number;
  weight?: number;
  medical_condition?: string;
}

const SwitchProfile: React.FC = () => {
  const navigate = useNavigate();
  const [petProfiles, setPetProfiles] = useState<any[]>([]); 
  const [pets, setPets] = useState<any[]>([]); // Adjust type as needed
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  useEffect(() => {
    // Get the current selected profile from localStorage
    const currentProfileId = localStorage.getItem("selectedPetProfileId");
    if (currentProfileId) {
      setSelectedProfileId(parseInt(currentProfileId));
    }
    
    const fetchPetProfiles = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.user_id) {
          setError("User not found. Please log in.");
          setLoading(false);
          return;
        }
  
        // Check if profiles are in cache
        const cachedProfiles = localStorage.getItem("cachedPetProfiles");
        if (cachedProfiles) {
          const { profiles, pets, timestamp } = JSON.parse(cachedProfiles);
          const now = new Date().getTime();
          const cacheAge = now - timestamp;
  
          // If cache is less than 5 minutes old, use it
          if (cacheAge < 5 * 60 * 1000) {
            setPetProfiles(profiles);
            setPets(pets);
            setLoading(false);
            return;
          }
        }
  
        const response = await healthService.getPetProfiles(user.user_id);
        setPetProfiles(response.petProfiles);
        setPets(response.pets);
  
        // Cache the profiles and pets together
        localStorage.setItem("cachedPetProfiles", JSON.stringify({
          profiles: response.petProfiles,
          pets: response.pets,
          timestamp: new Date().getTime()
        }));
      } catch (err) {
        setError("Failed to load pet profiles.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPetProfiles();
  }, []);

  const handleProfileSwitch = (petProfileId: number) => {
    localStorage.setItem("selectedPetProfileId", petProfileId.toString());
    setSelectedProfileId(petProfileId);
    navigate("/dashboard");
  };

  const addNewProfile = async (newProfile: PetProfile) => {
    // Your existing logic to add a new profile...
    
    // Update the cache with the new profile
    const cachedProfiles = localStorage.getItem("cachedPetProfiles");
    if (cachedProfiles) {
      const { profiles, pets, timestamp } = JSON.parse(cachedProfiles);
      profiles.push(newProfile); // Add the new profile to the list
      pets.push(newProfile); // Add the new profile to the pets list
      localStorage.setItem("cachedPetProfiles", JSON.stringify({
        profiles,
        pets,
        timestamp: new Date().getTime()
      }));
    }
  };

  const getBadgeColors = (index: number) => {
    const colors = [
      { bg: "bg-blue-100", text: "text-blue-800", dark: "dark:bg-blue-900/30", darkText: "dark:text-blue-300" },
      { bg: "bg-green-100", text: "text-green-800", dark: "dark:bg-green-900/30", darkText: "dark:text-green-300" },
      { bg: "bg-purple-100", text: "text-purple-800", dark: "dark:bg-purple-900/30", darkText: "dark:text-purple-300" },
      { bg: "bg-amber-100", text: "text-amber-800", dark: "dark:bg-amber-900/30", darkText: "dark:text-amber-300" },
      { bg: "bg-rose-100", text: "text-rose-800", dark: "dark:bg-rose-900/30", darkText: "dark:text-rose-300" },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Switch Pet Profile</h1>
            </div>
            <button
              onClick={() => navigate('/create-pet-profile')}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Pet
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 mb-6 rounded-lg flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : petProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No pet profiles found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">You don't have any pet profiles yet. Create your first pet profile to get started.</p>
            <button
              onClick={() => navigate('/create-pet-profile')}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Pet Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petProfiles.map((profile, index) => {
              // Find the corresponding pet details using pet_id
              const pet = (pets || []).find(p => p.pet_id === profile.Profile_pet_id);
              const colors = getBadgeColors(index);
              const isSelected = profile.PetProfile_id === selectedProfileId;
              
              return (
                <div 
                  key={profile.PetProfile_id} 
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-green-500 dark:ring-green-400' : 'hover:shadow-lg'
                  }`}
                >
                  <div className={`h-32 bg-gradient-to-r ${
                    index % 5 === 0 ? 'from-blue-400 to-indigo-500' :
                    index % 5 === 1 ? 'from-green-400 to-teal-500' :
                    index % 5 === 2 ? 'from-purple-400 to-pink-500' :
                    index % 5 === 3 ? 'from-amber-400 to-orange-500' : 
                    'from-rose-400 to-red-500'
                  } relative`}>
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start">
                      <img 
                        className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-md mr-4 -mt-14 object-cover bg-white" 
                        src={`https://source.unsplash.com/random/300x300/?${pet?.breed.toLowerCase().split(' ')[0] || 'pet'}`}
                        alt={pet?.pet_name || profile.pet_name} 
                      />
                      <div className="flex-1 pt-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {pet?.pet_name || profile.pet_name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {pet?.breed || profile.breed}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-6">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Age:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{pet?.age || 'Unknown'} {pet?.age === 1 ? 'year' : 'years'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Weight:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{pet?.weight || 'Unknown'} lbs</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-gray-500 dark:text-gray-400 block mb-1.5">Medical Condition:</span>
                        <p className="text-gray-900 dark:text-white">{pet?.medical_condition || "None"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.dark} ${colors.darkText}`}>
                        {index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'Healthy' : 'Vaccinated'}
                      </span>
                      <button
                        onClick={() => handleProfileSwitch(profile.PetProfile_id)}
                        disabled={isSelected}
                        className={`text-white font-medium py-2 px-4 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {isSelected ? 'Current Profile' : 'Switch Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default SwitchProfile;