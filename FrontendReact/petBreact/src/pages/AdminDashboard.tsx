import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService, { AdminStats } from '../services/adminService';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

interface AdminData {
  admin_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface User {
  user_id: number;
  username: string;
  email: string;
  pets: Pet[];
}

interface Pet {
  pet_id: number;
  pet_name: string;
  breed: string;
  PetProfile?: {
    HealthTracker?: {
      WeightTracking?: {
        Weight: number;
        date: string;
      };
      MedicalRecord?: {
        record_type: string;
        description: string;
        date: string;
        Vet: {
          username: string;
          specialty: string;
        };
      };
      DietPlan?: {
        plan_name: string;
        start_date: string;
        status: string;
        notes: string;
      };
    };
  };
}

interface Vet {
  vet_id: number;
  username: string;
  email: string;
  specialty: string;
  clinic: {
    name: string;
    address: string;
  };
  WorkingHours: {
    day_of_week: number;
    start_time: string;
    end_time: string;
  }[];
}

interface Trainer {
  trainer_id: number;
  username: string;
  email: string;
  experience_years: number;
  TrainingStyle: {
    primary_style: string;
    secondary_style: string;
    methodology: string;
  };
  WorkingHours: {
    day_of_week: number;
    start_time: string;
    end_time: string;
  }[];
  Sessions: {
    session_date: string;
    status: string;
    pet: {
      pet_name: string;
    };
  }[];
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [expandedUsers, setExpandedUsers] = useState<number[]>([]);
  const [expandedPets, setExpandedPets] = useState<number[]>([]);
  const [expandedVets, setExpandedVets] = useState<number[]>([]);
  const [expandedTrainers, setExpandedTrainers] = useState<number[]>([]);

  useEffect(() => {
    const checkAdminAuth = async () => {
      if (!adminService.isLoggedIn()) {
        navigate('/admin/login');
        return;
      }

      try {
        const adminDataStr = localStorage.getItem('adminData');
        if (adminDataStr) {
          const adminData = JSON.parse(adminDataStr);
          setAdminData(adminData);
        }
      } catch (err) {
        console.error('Error parsing admin data:', err);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      if (activeTab === 'overview') {
        try {
          const statsData = await adminService.getStats();
          setStats(statsData);
        } catch (err) {
          console.error('Error fetching stats:', err);
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            navigate('/admin/login');
          }
          setError('Failed to fetch dashboard statistics');
        }
      }
    };

    fetchStats();
  }, [activeTab, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, vetsData, trainersData] = await Promise.all([
          adminService.getUsers(),
          adminService.getVets(),
          adminService.getTrainers()
        ]);

        setUsers(usersData);
        setVets(vetsData);
        setTrainers(trainersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    adminService.logout();
    navigate('/admin/login');
  };

  const toggleUser = (userId: number) => {
    setExpandedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const togglePet = (petId: number) => {
    setExpandedPets(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId)
        : [...prev, petId]
    );
  };

  const toggleVet = (vetId: number) => {
    setExpandedVets(prev => 
      prev.includes(vetId) 
        ? prev.filter(id => id !== vetId)
        : [...prev, vetId]
    );
  };

  const toggleTrainer = (trainerId: number) => {
    setExpandedTrainers(prev => 
      prev.includes(trainerId) 
        ? prev.filter(id => id !== trainerId)
        : [...prev, trainerId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b dark:border-gray-700">
            <img className="h-8 w-auto" src="/images/logo.png" alt="PetBuddy Admin" />
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Admin Panel</span>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'overview'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Overview
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'users'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Users
            </button>

            <button
              onClick={() => setActiveTab('pets')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'pets'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Pets
            </button>

            <button
              onClick={() => setActiveTab('vets')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'vets'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Veterinarians
            </button>

            <button
              onClick={() => setActiveTab('trainers')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'trainers'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              Trainers
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'appointments'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Appointments
            </button>
          </nav>

          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${adminData?.first_name}+${adminData?.last_name}&background=0D9488&color=fff`}
                  alt=""
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {adminData?.first_name} {adminData?.last_name}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {adminData?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
          </div>
        </header>

        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Content will be rendered based on activeTab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Stats cards */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Total Users
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {stats?.totalUsers || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Total Pets
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {stats?.totalPets || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Total Vets
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {stats?.totalVets || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                            Total Appointments
                          </dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">
                            {stats?.totalAppointments || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Users Management
                  </h3>
                  <div className="mt-5">
                    {users.map(user => (
                      <div key={user.user_id} className="border rounded-lg p-4 mb-2">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleUser(user.user_id)}
                        >
                          {expandedUsers.includes(user.user_id) ? (
                            <ChevronDownIcon className="h-5 w-5 mr-2" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5 mr-2" />
                          )}
                          <span className="font-medium">{user.username}</span>
                        </div>
                        
                        {expandedUsers.includes(user.user_id) && (
                          <div className="ml-7 mt-2">
                            <p>Email: {user.email}</p>
                            <div className="mt-2">
                              <h3 className="font-medium">Pets:</h3>
                              {user.pets.map(pet => (
                                <div key={pet.pet_id} className="ml-4 mt-2">
                                  <div 
                                    className="flex items-center cursor-pointer"
                                    onClick={() => togglePet(pet.pet_id)}
                                  >
                                    {expandedPets.includes(pet.pet_id) ? (
                                      <ChevronDownIcon className="h-4 w-4 mr-2" />
                                    ) : (
                                      <ChevronRightIcon className="h-4 w-4 mr-2" />
                                    )}
                                    <span>{pet.pet_name} ({pet.breed})</span>
                                  </div>
                                  
                                  {expandedPets.includes(pet.pet_id) && pet.PetProfile?.HealthTracker && (
                                    <div className="ml-6 mt-2">
                                      <h4 className="font-medium">Health Tracker:</h4>
                                      {pet.PetProfile.HealthTracker.WeightTracking && (
                                        <p>Weight: {pet.PetProfile.HealthTracker.WeightTracking.Weight} kg</p>
                                      )}
                                      {pet.PetProfile.HealthTracker.MedicalRecord && (
                                        <p>Last Medical Record: {pet.PetProfile.HealthTracker.MedicalRecord.record_type}</p>
                                      )}
                                      {pet.PetProfile.HealthTracker.DietPlan && (
                                        <p>Current Diet: {pet.PetProfile.HealthTracker.DietPlan.plan_name}</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pets' && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Pets Management
                  </h3>
                  <div className="mt-5">
                    {/* Pets table will go here */}
                    <p className="text-gray-500 dark:text-gray-400">Pets table coming soon...</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vets' && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Veterinarians Management
                  </h3>
                  <div className="mt-5">
                    {vets.map(vet => (
                      <div key={vet.vet_id} className="border rounded-lg p-4 mb-2">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleVet(vet.vet_id)}
                        >
                          {expandedVets.includes(vet.vet_id) ? (
                            <ChevronDownIcon className="h-5 w-5 mr-2" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5 mr-2" />
                          )}
                          <span className="font-medium">{vet.username}</span>
                        </div>
                        
                        {expandedVets.includes(vet.vet_id) && (
                          <div className="ml-7 mt-2">
                            <p>Email: {vet.email}</p>
                            <p>Specialty: {vet.specialty}</p>
                            {vet.clinic && (
                              <p>Clinic: {vet.clinic.name}</p>
                            )}
                            <div className="mt-2">
                              <h3 className="font-medium">Working Hours:</h3>
                              {vet.WorkingHours.map((hours, index) => (
                                <p key={index} className="ml-4">
                                  Day {hours.day_of_week}: {new Date(hours.start_time).toLocaleTimeString()} - {new Date(hours.end_time).toLocaleTimeString()}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trainers' && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Trainers Management
                  </h3>
                  <div className="mt-5">
                    {trainers.map(trainer => (
                      <div key={trainer.trainer_id} className="border rounded-lg p-4 mb-2">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleTrainer(trainer.trainer_id)}
                        >
                          {expandedTrainers.includes(trainer.trainer_id) ? (
                            <ChevronDownIcon className="h-5 w-5 mr-2" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5 mr-2" />
                          )}
                          <span className="font-medium">{trainer.username}</span>
                        </div>
                        
                        {expandedTrainers.includes(trainer.trainer_id) && (
                          <div className="ml-7 mt-2">
                            <p>Email: {trainer.email}</p>
                            <p>Experience: {trainer.experience_years} years</p>
                            {trainer.TrainingStyle && (
                              <>
                                <p>Primary Style: {trainer.TrainingStyle.primary_style}</p>
                                <p>Secondary Style: {trainer.TrainingStyle.secondary_style}</p>
                              </>
                            )}
                            <div className="mt-2">
                              <h3 className="font-medium">Working Hours:</h3>
                              {trainer.WorkingHours.map((hours, index) => (
                                <p key={index} className="ml-4">
                                  Day {hours.day_of_week}: {new Date(hours.start_time).toLocaleTimeString()} - {new Date(hours.end_time).toLocaleTimeString()}
                                </p>
                              ))}
                            </div>
                            {trainer.Sessions && trainer.Sessions.length > 0 && (
                              <div className="mt-2">
                                <h3 className="font-medium">Recent Sessions:</h3>
                                {trainer.Sessions.slice(0, 3).map((session, index) => (
                                  <p key={index} className="ml-4">
                                    {new Date(session.session_date).toLocaleDateString()} - {session.pet.pet_name} ({session.status})
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Appointments Management
                  </h3>
                  <div className="mt-5">
                    {/* Appointments table will go here */}
                    <p className="text-gray-500 dark:text-gray-400">Appointments table coming soon...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 