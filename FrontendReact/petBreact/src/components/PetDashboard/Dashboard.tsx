import * as React from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useState, useEffect } from "react";
import { authService } from "../../services/api";
import api from "../../services/api";
import healthService, {
  HealthTracker,
  
  AddMedicalRecordData,
  AddDietPlanData,
  Appointment,
} from "../../services/healthService";
import AddWeightModal from "./AddWeightModal";
import AddMedicalRecordModal from "./AddMedicalRecordModal";
import AddDietPlanModal from "./AddDietPlanModal";
import { useNavigate } from "react-router-dom";
import cat from "../../assets/cat.jpg";
import paw from "../../assets/paw.svg";

interface PetProfile {
  Profile_pet_id: number;
  pet_name: string;
  breed: string;
  age: number;
  weight: number;
  medical_condition: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = React.useState("appointments");
  const [healthData, setHealthData] = useState<HealthTracker | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [isDietPlanModalOpen, setIsDietPlanModalOpen] = useState(false);

  const [petProfile, setPetProfile] = useState<PetProfile | null>(null);
  const [pet, setPet] = useState<any>(null);

  // Flags for conditional fetching
  const [isWeightUpdated, setIsWeightUpdated] = useState(false);
  const [isMedicalUpdated, setIsMedicalUpdated] = useState(false);
  const [isDietPlanUpdated, setIsDietPlanUpdated] = useState(false);

  // First, add a state for the dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAppointmentsLoading, setIsAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchHealthData = async () => {
      if (
        activeTab === "health" ||
        isWeightUpdated ||
        isMedicalUpdated ||
        isDietPlanUpdated
      ) {
        try {
          setLoading(true);
          setError(null);

          // Get selected pet profile ID from localStorage
          const selectedPetProfileId = localStorage.getItem(
            "selectedPetProfileId",
          );
          console.log(
            "[fetchHealthData] Selected pet profile ID from localStorage:",
            selectedPetProfileId,
          );

          if (!selectedPetProfileId) {
            setError("No pet profile selected");
            setLoading(false);
            return;
          }

          try {
            // First check if a health tracker already exists, but don't auto-create

            try {
              const response = await api.get(
                `health/health-tracker/${selectedPetProfileId}`,
              );
              console.log(
                "[fetchHealthData] Health tracker already exists:",
                response.data,
              );
            } catch (err: any) {
              if (err.response && err.response.status === 404) {
                console.log(
                  "[fetchHealthData] Health tracker doesn't exist yet",
                );
              } else {
                throw err;
              }
            }

            // Now get the health tracker
            console.log("[fetchHealthData] Fetching health tracker...");
            const healthTrackerResponse = await healthService.getHealthTracker(
              Number(selectedPetProfileId),
            );
            console.log(
              "[fetchHealthData] Health tracker response:",
              healthTrackerResponse,
            );

            if (healthTrackerResponse) {
              setHealthData(healthTrackerResponse);
              console.log("[fetchHealthData] Set health data successfully");
            }
          } catch (err: any) {
            console.error("[fetchHealthData] Error:", err);
            if (err.response) {
              console.error(
                "[fetchHealthData] API error response:",
                err.response.data,
              );
            }
            throw err;
          }

          // Reset update flags after fetching
          setIsWeightUpdated(false);
          setIsMedicalUpdated(false);
          setIsDietPlanUpdated(false);
        } catch (err: any) {
          console.error("[fetchHealthData] Final error:", err);
          setError(err.response?.data?.message || "Failed to load health data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHealthData();
  }, [activeTab, isWeightUpdated, isMedicalUpdated, isDietPlanUpdated]);

  useEffect(() => {
    const fetchPetProfile = async () => {
      console.log("one");
      const selectedPetProfileId = localStorage.getItem("selectedPetProfileId");
      console.log("Selected Pet Profile ID:", selectedPetProfileId);

      if (!selectedPetProfileId) {
        setError("No pet profile selected.");
        return;
      }

      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("User:", user);

        const response = await healthService.getPetProfiles(user.user_id);
        console.log("Pet profiles response:", response);

        // Find the matching pet profile using PetProfile_id
        const profile = response.petProfiles.find(
          (p: any) => p.PetProfile_id === Number(selectedPetProfileId),
        );
        console.log("Found profile:", profile);

        if (!profile) {
          setError("Pet profile not found.");
          return;
        }

        // Find the matching pet data
        const pet = response.pets.find(
          (p: any) => p.pet_id === profile.Profile_pet_id,
        );
        console.log("Found pet:", pet);

        if (!pet) {
          setError("Pet data not found.");
          return;
        }

        // Set both profile and pet data
        setPetProfile(profile);
        setPet(pet);

        // Update cache
        localStorage.setItem(
          "cachedPetProfiles",
          JSON.stringify({
            profiles: response.petProfiles,
            pets: response.pets,
            timestamp: new Date().getTime(),
          }),
        );
      } catch (err) {
        setError("Failed to load pet profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPetProfile();
  }, []);

  // Add new useEffect for fetching appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!petProfile?.Profile_pet_id) return;

      try {
        setIsAppointmentsLoading(true);
        setAppointmentsError(null);
        const userStr = localStorage.getItem("user");
        console.log("Raw user data from localStorage:", userStr);
        const user = userStr ? JSON.parse(userStr) : {};
        console.log("Parsed user data:", user);

        if (!user.user_id) {
          console.error("No user_id found in localStorage");
          setAppointmentsError("User data not found. Please log in again.");
          return;
        }

        const response = await healthService.getAppointments(user.user_id);
        console.log("Appointments response:", response);
        // Extract the data array from the response
        setAppointments(response.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointmentsError("Failed to fetch appointments");
        setAppointments([]); // Set empty array on error
      } finally {
        setIsAppointmentsLoading(false);
      }
    };

    fetchAppointments();
  }, [petProfile?.Profile_pet_id]);

  // Modal control functions
  const openWeightModal = () => setIsWeightModalOpen(true);
  const closeWeightModal = () => setIsWeightModalOpen(false);

  const openMedicalModal = () => setIsMedicalModalOpen(true);
  const closeMedicalModal = () => setIsMedicalModalOpen(false);

  const openDietPlanModal = () => setIsDietPlanModalOpen(true);
  const closeDietPlanModal = () => setIsDietPlanModalOpen(false);

  // Function to add a new weight record
  const addWeightRecord = async (weight: number) => {
    if (!healthData) return;

    try {
      setLoading(true);
      const data = {
        Weight: weight,
        date: new Date(),
      };

      await healthService.addWeightEntry(healthData.HealthTrackr_id, data);
      setIsWeightUpdated(true);
      setLoading(false);
    } catch (err: any) {
      console.error("Error adding weight record:", err);
      setError(err.response?.data?.message || "Failed to add weight record");
      setLoading(false);
    }
  };

  // Function to add a new medical record
  const addMedicalRecord = async (data: {
    record_type: string;
    description: string;
    vet_id: number;
  }) => {
    if (!healthData) return;

    try {
      setLoading(true);
      const medicalData: AddMedicalRecordData = {
        ...data,
        date: new Date(),
      };

      console.log(
        "Adding medical record with health tracker ID:",
        healthData.HealthTrackr_id,
      );

      await healthService.addMedicalRecord(
        healthData.HealthTrackr_id,
        medicalData,
      );
      setIsMedicalUpdated(true);
      setLoading(false);
    } catch (err: any) {
      console.error("Error adding medical record:", err);
      setError(err.response?.data?.message || "Failed to add medical record");
      setLoading(false);
    }
  };

  // Function to add a new diet plan
  const addDietPlan = async (data: {
    plan_name: string;
    notes: string;
    status: "Active" | "Completed";
  }) => {
    if (!healthData) return;

    try {
      setLoading(true);
      const dietData: AddDietPlanData = {
        ...data,
        start_date: new Date(),
      };

      await healthService.addDietPlan(healthData.HealthTrackr_id, dietData);
      setIsDietPlanUpdated(true);
      setLoading(false);
    } catch (err: any) {
      console.error("Error adding diet plan:", err);
      setError(err.response?.data?.message || "Failed to add diet plan");
      setLoading(false);
    }
  };

  // Function to delete a health record based on type
  const deleteHealthRecord = async (
    type: "Weight" | "Medical" | "Diet",
    id: number,
  ) => {
    if (!healthData) return;

    try {
      setLoading(true);

      if (type === "Weight") {
        await healthService.deleteWeightEntry(id);
        setIsWeightUpdated(true);
      } else if (type === "Medical") {
        await healthService.deleteMedicalRecord(id);
        setIsMedicalUpdated(true);
      } else if (type === "Diet") {
        await healthService.deleteDietPlan(id);
        setIsDietPlanUpdated(true);
      }

      setLoading(false);
    } catch (err: any) {
      console.error(`Error deleting ${type} record:`, err);
      setError(
        err.response?.data?.message || `Failed to delete ${type} record`,
      );
      setLoading(false);
    }
  };

  const trainingProgress = [
    {
      id: 1,
      skill: "Sit",
      progress: 100,
      startDate: "2023-03-15",
      completedDate: "2023-04-01",
    },
    {
      id: 2,
      skill: "Stay",
      progress: 75,
      startDate: "2023-04-10",
      completedDate: null,
    },
    {
      id: 3,
      skill: "Fetch",
      progress: 60,
      startDate: "2023-05-01",
      completedDate: null,
    },
    {
      id: 4,
      skill: "Roll Over",
      progress: 30,
      startDate: "2023-05-20",
      completedDate: null,
    },
  ];

  const handleEditProfile = () => {
    if (petProfile && pet) {
      // Store the current pet data in localStorage for the edit page to access
      localStorage.setItem(
        "editingPetProfile",
        JSON.stringify({
          profile: petProfile,
          pet: pet,
        }),
      );
      navigate("/edit-pet-profile");
    } else {
      setError("No pet profile selected for editing.");
    }
  };

  // Add the logout function
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Add this inside the appointments tab content
  const renderAppointmentsTab = () => {
    if (isAppointmentsLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      );
    }

    if (appointmentsError) {
      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {appointmentsError}
        </div>
      );
    }

    if (!Array.isArray(appointments) || appointments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <svg
            className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
            No appointments found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Schedule your pet's first appointment to get started.
          </p>
          <button
            onClick={() => {
              /* Add appointment creation handler */
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Schedule Appointment
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.appointment_id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-600 dark:text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {appointment.appointment_type}
                </h3>
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                  <span className="mx-2">•</span>
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {new Date(appointment.start_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {appointment.notes && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                    {appointment.notes}
                  </p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center whitespace-nowrap ${
                  appointment.status === "SCHEDULED"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : appointment.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-1.5 ${
                    appointment.status === "SCHEDULED"
                      ? "bg-green-600 dark:bg-green-400"
                      : appointment.status === "COMPLETED"
                        ? "bg-blue-600 dark:bg-blue-400"
                        : "bg-red-600 dark:bg-red-400"
                  }`}
                ></span>
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img className="w-10 h-10 mr-3" src={paw} alt="PetBuddy logo" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              PetBuddy
            </h1>
          </div>
          <div className="flex items-center space-x-5">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
              title={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <span className="mr-2 font-medium">Rohit Dhawadkar</span>
                <img
                  className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User profile"
                />
                <svg
                  className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? "transform rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => navigate("/pet-profiles")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors shadow-sm hover:shadow flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m-8 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Switch Pet Profile
          </button>
          <button
            onClick={() => navigate("/create-pet-profile")}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors shadow-sm hover:shadow flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Pet Profile
          </button>
        </div>

        {/* Pet Profile Summary */}
        {petProfile && pet && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
              <div className="absolute bottom-4 left-4 bg-white/20 dark:bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Active Profile
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 -mt-24 relative z-10">
                  <img
                    className="w-44 h-44 rounded-xl border-4 border-white dark:border-gray-800 object-cover shadow-lg bg-white transition-transform hover:scale-105 duration-300"
                    src={cat}
                    alt={`${pet.pet_name}'s profile`}
                  />
                </div>

                <div className="mt-6 md:mt-0 md:ml-8 flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {pet.pet_name}
                      </h2>
                      <div className="flex flex-wrap items-center mt-2 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center mr-4 mb-2">
                          <svg
                            className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                          </svg>
                          <span className="text-lg">{pet.breed}</span>
                        </div>
                        <div className="flex items-center mr-4 mb-2">
                          <svg
                            className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-lg">
                            {pet.age} {pet.age === 1 ? "year" : "years"} old
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          <svg
                            className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                            />
                          </svg>
                          <span className="text-lg">{pet.weight} lbs</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <button
                        onClick={handleEditProfile}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center shadow-md hover:shadow-lg"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-3">
                        Health Status
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300 transition-colors hover:bg-green-200 dark:hover:bg-green-700/50">
                          <svg
                            className="w-3.5 h-3.5 mr-1.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Vaccinated
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-700/30 dark:text-blue-300 transition-colors hover:bg-blue-200 dark:hover:bg-blue-700/50">
                          <svg
                            className="w-3.5 h-3.5 mr-1.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Neutered
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-700/30 dark:text-purple-300 transition-colors hover:bg-purple-200 dark:hover:bg-purple-700/50">
                          <svg
                            className="w-3.5 h-3.5 mr-1.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Microchipped
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-1">
                      <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium mb-3">
                        Medical Condition
                      </h3>
                      {pet.medical_condition ? (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-700 dark:text-red-300 py-2 px-3 rounded-lg text-sm">
                          <div className="flex items-start">
                            <svg
                              className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                            <span>{pet.medical_condition}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 text-green-700 dark:text-green-300 py-2 px-3 rounded-lg text-sm">
                          <div className="flex items-start">
                            <svg
                              className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>No known medical conditions</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex flex-wrap space-x-1 sm:space-x-8">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`py-4 px-4 relative font-medium text-sm focus:outline-none transition-colors ${
                activeTab === "appointments"
                  ? "text-green-600 dark:text-green-500"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Appointments
              </span>
              {activeTab === "appointments" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 dark:bg-green-500 rounded-t-lg"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("health")}
              className={`py-4 px-4 relative font-medium text-sm focus:outline-none transition-colors ${
                activeTab === "health"
                  ? "text-green-600 dark:text-green-500"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Health Tracker
              </span>
              {activeTab === "health" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 dark:bg-green-500 rounded-t-lg"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("training")}
              className={`py-4 px-4 relative font-medium text-sm focus:outline-none transition-colors ${
                activeTab === "training"
                  ? "text-green-600 dark:text-green-500"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Training
              </span>
              {activeTab === "training" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 dark:bg-green-500 rounded-t-lg"></span>
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Appointments
                </h2>
                <button
                  onClick={() => {
                    /* Add appointment creation handler */
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm hover:shadow"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Appointment
                </button>
              </div>
              {renderAppointmentsTab()}
            </div>
          )}

          {/* Health Tracker Tab */}
          {activeTab === "health" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Health Tracker
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={openWeightModal}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Weight
                  </button>
                  <button
                    onClick={openMedicalModal}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Add Medical Record
                  </button>
                  <button
                    onClick={openDietPlanModal}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Add Diet Plan
                  </button>
                </div>
              </div>

              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
              )}

              {error && (
                <div
                  className="p-5 mb-6 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-400 flex items-start"
                  role="alert"
                >
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {!loading && !error && healthData && (
                <div>
                  {/* Health Tracker Dashboard */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-green-100 dark:border-green-900/30">
                      <div className="flex items-center mb-4">
                        <svg
                          className="w-6 h-6 text-green-600 dark:text-green-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                          />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Current Weight
                        </h3>
                      </div>
                      {healthData?.WeightTracking &&
                      healthData.WeightTracking.Weight !== null ? (
                        <>
                          <p className="text-3xl font-bold text-green-600 dark:text-green-500 mb-2">
                            {healthData.WeightTracking.Weight} lbs
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-3">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {healthData.WeightTracking.Weight > 0
                              ? `Last updated: ${new Date(healthData.WeightTracking.date).toLocaleDateString()}`
                              : "Add your pet's weight to start tracking"}
                          </p>
                          <button
                            onClick={openWeightModal}
                            className="text-sm bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 text-green-700 dark:text-green-400 font-medium py-1.5 px-3 rounded-lg transition-colors border border-green-200 dark:border-gray-600 flex items-center"
                          >
                            <svg
                              className="w-3.5 h-3.5 mr-1.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Update Weight
                          </button>
                          {healthData.WeightTracking.id && (
                            <button
                              onClick={() => deleteHealthRecord("Weight", healthData.WeightTracking.id)}
                              className="text-sm bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 font-medium py-1.5 px-3 rounded-lg transition-colors border border-red-200 dark:border-gray-600 flex items-center mt-2"
                            >
                              <svg
                                className="w-3.5 h-3.5 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete Record
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24">
                          <p className="text-gray-500 dark:text-gray-400 mb-3">
                            No weight records yet
                          </p>
                          <button
                            onClick={openWeightModal}
                            className="text-sm bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 text-green-700 dark:text-green-400 font-medium py-1.5 px-3 rounded-lg transition-colors border border-green-200 dark:border-gray-600 flex items-center"
                          >
                            <svg
                              className="w-3.5 h-3.5 mr-1.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Add First Record
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900/30">
                      <div className="flex items-center mb-4">
                        <svg
                          className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Current Diet Plan
                        </h3>
                      </div>
                      {healthData?.DietPlan && healthData.DietPlan.plan_name ? (
                        <>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-500 mb-2">
                            {healthData.DietPlan.plan_name}
                          </p>
                          <div className="mb-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Status:{" "}
                            </span>
                            <span
                              className={`text-sm font-medium ${
                                healthData.DietPlan.status === "Active"
                                  ? "text-green-600 dark:text-green-500"
                                  : "text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {healthData.DietPlan.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            {healthData.DietPlan.notes}
                          </p>
                          <button
                            onClick={openDietPlanModal}
                            className="text-sm bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-blue-700 dark:text-blue-400 font-medium py-1.5 px-3 rounded-lg transition-colors border border-blue-200 dark:border-gray-600 flex items-center"
                          >
                            <svg
                              className="w-3.5 h-3.5 mr-1.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Update Diet Plan
                          </button>
                          {healthData.DietPlan.id && (
                            <button
                              onClick={() => deleteHealthRecord("Diet", healthData.DietPlan.id)}
                              className="text-sm bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 font-medium py-1.5 px-3 rounded-lg transition-colors border border-red-200 dark:border-gray-600 flex items-center mt-2"
                            >
                              <svg
                                className="w-3.5 h-3.5 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete Diet Plan
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24">
                          <p className="text-gray-500 dark:text-gray-400 mb-3">
                            No diet plan yet
                          </p>
                          <button
                            onClick={openDietPlanModal}
                            className="text-sm bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 text-blue-700 dark:text-blue-400 font-medium py-1.5 px-3 rounded-lg transition-colors border border-blue-200 dark:border-gray-600 flex items-center"
                          >
                            <svg
                              className="w-3.5 h-3.5 mr-1.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Create Diet Plan
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-sm border border-purple-100 dark:border-purple-900/30">
                      <div className="flex items-center mb-4">
                        <svg
                          className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                          />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Latest Medical Check
                        </h3>
                      </div>
                      {healthData?.MedicalRecord &&
                      healthData.MedicalRecord.record_type ? (
                        <>
                          <p className="text-xl font-bold text-purple-600 dark:text-purple-500 mb-2">
                            {healthData.MedicalRecord.record_type}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {healthData.MedicalRecord.description}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-3">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {new Date(
                              healthData.MedicalRecord.date,
                            ).toLocaleDateString()}
                          </p>
                          <button
                            onClick={openMedicalModal}
                            className="text-sm bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 text-purple-700 dark:text-purple-400 font-medium py-1.5 px-3 rounded-lg transition-colors border border-purple-200 dark:border-gray-600 flex items-center"
                          >
                            <svg
                              className="w-3.5 h-3.5 mr-1.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Add Medical Record
                          </button>
                          {healthData.MedicalRecord.Medical_Record_id && (
                            <button
                              onClick={() => deleteHealthRecord("Medical", healthData.MedicalRecord.Medical_Record_id)}
                              className="text-sm bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 font-medium py-1.5 px-3 rounded-lg transition-colors border border-red-200 dark:border-gray-600 flex items-center mt-2"
                            >
                              <svg
                                className="w-3.5 h-3.5 mr-1.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete Record
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24">
                          <p className="text-gray-500 dark:text-gray-400 mb-3">
                            No medical records yet
                          </p>
                          <button
                            onClick={openMedicalModal}
                            className="text-sm bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-gray-600 text-purple-700 dark:text-purple-400 font-medium py-1.5 px-3 rounded-lg transition-colors border border-purple-200 dark:border-gray-600 flex items-center"
                          >
                            <svg
                              className="w-3.5 h-3.5 mr-1.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Add Medical Record
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Components */}
              <AddWeightModal
                isOpen={isWeightModalOpen}
                onClose={closeWeightModal}
                onSave={addWeightRecord}
              />

              <AddMedicalRecordModal
                isOpen={isMedicalModalOpen}
                onClose={closeMedicalModal}
                onSave={addMedicalRecord}
                isLoading={loading}
              />

              <AddDietPlanModal
                isOpen={isDietPlanModalOpen}
                onClose={closeDietPlanModal}
                onSave={addDietPlan}
                isLoading={loading}
              />
            </div>
          )}

          {/* Training Tab */}
          {activeTab === "training" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Training Progress
                </h2>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center shadow-sm hover:shadow">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Skill
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {trainingProgress.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                        {skill.skill}
                      </h3>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        {skill.completedDate ? (
                          <span className="flex items-center text-green-600 dark:text-green-400">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Completed on {skill.completedDate}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Started: {skill.startDate}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="relative pt-1 mb-4">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded ${
                            skill.progress === 100
                              ? "bg-green-500 dark:bg-green-600"
                              : "bg-indigo-500 dark:bg-indigo-600"
                          }`}
                          style={{ width: `${skill.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-medium ${
                          skill.progress === 100
                            ? "text-green-600 dark:text-green-400"
                            : "text-indigo-600 dark:text-indigo-400"
                        }`}
                      >
                        {skill.progress}% Complete
                      </span>
                      {skill.progress < 100 && (
                        <button className="text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 py-1.5 px-3 rounded-lg transition-colors flex items-center">
                          <svg
                            className="w-3.5 h-3.5 mr-1.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Update Progress
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
