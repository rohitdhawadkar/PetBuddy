import api from './api';

export interface WeightTracking {
  id: number;
  Weight: number;
  date: string;
}

export interface MedicalRecord {
  Medical_Record_id: number;
  health_tracker_id: number;
  record_type: string;
  description: string;
  date: Date;
  vet_id: number;
  createdAt: Date;
  UpdatedAt: Date;
}

export interface DietPlan {
  id: number;
  plan_name: string;
  start_date: string;
  status: 'Active' | 'Completed';
  notes: string;
}

export interface HealthTracker {
  HealthTrackr_id: number;
  h_petProfile_id: number;
  WeightTracking: WeightTracking;
  MedicalRecord: MedicalRecord;
  DietPlan: DietPlan;
}

export interface AddWeightData {
  Weight: number;
  date: Date;
}

export interface AddMedicalRecordData {
  record_type: string;
  description: string;
  date?: Date;
  vet_id: number;
}

export interface AddDietPlanData {
  plan_name: string;
  start_date?: Date;
  status: 'Active' | 'Completed';
  notes: string;
}

export interface Appointment {
  appointment_id: number;
  pet_id: number;
  vet_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  appointment_type: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  pet?: {
    pet_name: string;
    breed: string;
  };
  vet?: {
    username: string;
    specialty: string;
  };
}

export const healthService = {
  // Initialize health tracker for a new user
  initializeHealthTracker: async (petProfileId: number): Promise<HealthTracker> => {
    try {
      console.log(`Starting health tracker initialization for pet profile ${petProfileId}`);
      
      // Check if health tracker already exists
      try {
        console.log(`Checking if health tracker already exists for profile ${petProfileId}`);
        const existingTracker = await api.get<HealthTracker>(`health/health-tracker/${petProfileId}`);
        if (existingTracker && existingTracker.data) {
            console.log(`Health tracker already exists:`, existingTracker.data);
            return existingTracker.data;
        }
        throw new Error('Health tracker not found');
      } catch (error: any) {
        // If 404, create new tracker
        if (error.response && error.response.status === 404) {
          console.log(`No health tracker found for profile ${petProfileId}, creating new one`);
        } else {
          console.error(`Unexpected error checking for health tracker:`, error);
          throw error;
        }
      }
      
      // Create new health tracker with default values
      const currentDate = new Date();
      
      const payload = {
        h_petProfile_id: petProfileId,
        // Add default values for required components
        weight: {
          Weight: 0, // Default weight (will be updated with real data)
          date: currentDate
        },
        medicalRecord: {
          record_type: "Initial Check",
          description: "Initial health record created automatically.",
          date: currentDate,
          vet_id: 2 // Default vet ID - ensure this exists in your database
        },
        dietPlan: {
          plan_name: "Default Diet Plan",
          start_date: currentDate,
          status: 'Active' as const,
          notes: "Default diet plan. Please update with specific requirements."
        }
      };
      
      console.log(`Creating health tracker with payload:`, payload);
      const response = await api.post<{data: HealthTracker}>('health/health-tracker', payload);
      console.log(`Health tracker created successfully:`, response.data);
      return response.data.data;
    } catch (error) {
      console.error(`Error initializing health tracker for profile ${petProfileId}:`, error);
      throw error;
    }
  },
  createPetProfile: async (petProfileData: {
    pet_name: string;
    breed: string;
    age: number;
    weight: number;
    medical_condition: string;
    user_id: number;
  }) => {
    try {
      console.log("Creating pet profile with data:", petProfileData);
      
      // Create the pet profile
      const response = await api.post('/petprofile/create-pet-profile', petProfileData);
      
      console.log("Pet profile created:", response.data);
      
      // If profile creation was successful, initialize a health tracker
      if (response.data && response.data.petProfile && response.data.petProfile.PetProfile_id) {
        try {
          const profileId = response.data.petProfile.PetProfile_id;
          console.log(`Initializing health tracker for new pet profile ${profileId}`);
          const healthTracker = await healthService.initializeHealthTracker(profileId);
          
          // Include the health tracker in the response
          return {
            ...response.data,
            healthTracker
          };
        } catch (err) {
          console.error("Failed to initialize health tracker for new profile:", err);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating pet profile:", error);
      throw error;
    }
  },

  // Get health tracker for a pet
  getHealthTracker: async (petProfileId: number, autoCreate: boolean = true): Promise<HealthTracker> => {
    try {
      // Try to get existing health tracker
      try {
        const response = await api.get<HealthTracker>(`health/health-tracker/${petProfileId}`);
        console.log(`[getHealthTracker] Found existing health tracker for profile ${petProfileId}`);
        return response.data;
      } catch (error: any) {
        // If not found and autoCreate is true, create a new one
        if (error.response?.status === 404 && autoCreate) {
          console.log(`[getHealthTracker] Health tracker not found for profile ${petProfileId}, creating new one`);
          return await healthService.initializeHealthTracker(petProfileId);
        }
        
        console.log(`[getHealthTracker] Health tracker not found for profile ${petProfileId} and autoCreate=${autoCreate}, propagating error`);
        throw error;
      }
    } catch (error) {
      console.error(`[getHealthTracker] Error for profile ${petProfileId}:`, error);
      throw error;
    }
  },

  getPetProfiles: async (userId: number) => {
    try {
      console.log(`Getting pet profiles for user ${userId}`);
      const response = await api.get(`http://localhost:3000/petprofile/get-pet-profile/${userId}`);
      
      // Don't auto-initialize health trackers here, just return the profiles
      console.log(`Found ${response.data.petProfiles?.length || 0} pet profiles`);
      
      return response.data;
    } catch (error) {
      console.error("Error getting pet profiles:", error);
      throw error;
    }
  },

  updatePetProfile: async (petProfileData: {
    Profile_pet_id: number;
    pet_name: string;
    breed: string;
    age: number;
    weight: number;
    medical_condition: string;
    user_id: number;
  }) => {
    try {
      console.log("Updating pet profile:", petProfileData);
      
      // Remove the health tracker check and creation
      const response = await api.put(`/petprofile/update-pet-profile/${petProfileData.Profile_pet_id}`, petProfileData);
      
      console.log("Pet profile updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating pet profile:", error);
      throw error;
    }
  },
  // Update health tracker components
  updateHealthTracker: async (
    petProfileId: number,
    data: {
      weight?: AddWeightData;
      medicalRecord?: AddMedicalRecordData;
      dietPlan?: AddDietPlanData;
    }
  ) => {
    try {
      const response = await api.put(`health/health-tracker/${petProfileId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating health tracker:", error);
      throw error;
    }
  },

  // Add a new weight entry
  addWeightEntry: async (
    healthTrackerId: number,
    data: AddWeightData
  ) => {
    try {
      const response = await api.post(`health/weight-tracking`, {
        health_tracker_id: healthTrackerId,
        Weight: data.Weight,
        date: data.date
      });
      return response.data;
    } catch (error) {
      console.error("Error adding weight entry:", error);
      throw error;
    }
  },

  // Delete a weight entry
  deleteWeightEntry: async (weightTrackingId: number) => {
    try {
      const response = await api.delete(`/weight-tracking/${weightTrackingId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting weight entry:", error);
      throw error;
    }
  },

  // Add a new medical record
  addMedicalRecord: async (
    healthTrackerId: number,
    data: AddMedicalRecordData
  ) => {
    try {
      console.log("healthService.addMedicalRecord called with:", { healthTrackerId, data });
      
      const response = await api.post(`/medical-record`, {
        health_tracker_id: healthTrackerId,
        record_type: data.record_type,
        description: data.description,
        date: data.date || new Date(),
        vet_id: data.vet_id
      });
      
      console.log("Medical record creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding medical record:", error);
      throw error;
    }
  },

  // Delete a medical record
  deleteMedicalRecord: async (medicalRecordId: number) => {
    try {
      const response = await api.delete(`/medical-record/${medicalRecordId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting medical record:", error);
      throw error;
    }
  },

  // Add a new diet plan
  addDietPlan: async (
    healthTrackerId: number,
    data: AddDietPlanData
  ) => {
    try {
      console.log("Adding diet plan with data:", { healthTrackerId, data });
      
      const response = await api.post(`health/diet-plan`, {
        health_tracker_id: healthTrackerId,
        plan_name: data.plan_name,
        start_date: data.start_date || new Date(),
        status: data.status,
        notes: data.notes
      });
      
      console.log("Diet plan creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding diet plan:", error);
      throw error;
    }
  },

  // Update diet plan
  updateDietPlan: async (
    dietPlanId: number,
    data: Partial<AddDietPlanData>
  ) => {
    try {
      console.log("Updating diet plan:", { dietPlanId, data });
      
      const response = await api.put(`health/diet-plan/${dietPlanId}`, data);
      
      console.log("Diet plan update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating diet plan:", error);
      throw error;
    }
  },

  // Delete a diet plan
  deleteDietPlan: async (dietPlanId: number) => {
    try {
      const response = await api.delete(`health/diet-plan/${dietPlanId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting diet plan:", error);
      throw error;
    }
  },

  // Make sure all pet profiles for a user have health trackers
  ensureHealthTrackersForUser: async (userId: number): Promise<void> => {
    try {
      console.log(`Ensuring health trackers for all profiles of user ${userId}`);
      
      // Get all pet profiles for this user
      const response = await api.get(`/petprofile/get-pet-profile/${userId}`);
      const profiles = response.data.petProfiles || [];
      
      console.log(`Found ${profiles.length} pet profiles for user ${userId}`);
      
      // Process each profile in sequence
      for (const profile of profiles) {
        try {
          console.log(`Checking health tracker for profile ${profile.PetProfile_id}`);
          
          // Check if a tracker already exists (but don't auto-create)
          try {
            await healthService.getHealthTracker(profile.PetProfile_id, false);
            console.log(`Health tracker already exists for profile ${profile.PetProfile_id}, skipping creation`);
          } catch (error: any) {
            // If not found (404), create a new health tracker
            if (error.response && error.response.status === 404) {
              console.log(`Creating health tracker for profile ${profile.PetProfile_id}`);
              await healthService.initializeHealthTracker(profile.PetProfile_id);
              console.log(`Successfully created health tracker for profile ${profile.PetProfile_id}`);
            } else {
              // Other error
              throw error;
            }
          }
        } catch (err) {
          console.error(`Error ensuring health tracker for profile ${profile.PetProfile_id}:`, err);
        }
      }
    } catch (error) {
      console.error(`Error ensuring health trackers for user ${userId}:`, error);
    }
  },

  // Get all appointments for a pet
  getAppointments: async (UserId: number): Promise<{ data: Appointment[] }> => {
    try {
      const response = await api.get(`clinic/appointments/user/${UserId}`);
      console.log("Appointments fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  },
};

export default healthService; 