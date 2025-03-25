import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../contexts/DarkModeContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = React.useState("appointments");

  // Dummy data for the dashboard
  const appointments = [
    { id: 1, date: "2023-06-15", time: "10:00 AM", type: "Vaccination", doctor: "Dr. Smith", status: "Upcoming" },
    { id: 2, date: "2023-06-22", time: "3:30 PM", type: "Check-up", doctor: "Dr. Johnson", status: "Upcoming" },
    { id: 3, date: "2023-05-30", time: "2:00 PM", type: "Dental", doctor: "Dr. Wilson", status: "Completed" },
  ];

  const healthRecords = [
    { id: 1, date: "2023-06-01", weight: "24 lbs", height: "15 inches", notes: "Healthy, good coat condition" },
    { id: 2, date: "2023-05-01", weight: "23.5 lbs", height: "15 inches", notes: "Slight weight gain, diet adjustment recommended" },
    { id: 3, date: "2023-04-01", weight: "23 lbs", height: "14.8 inches", notes: "Normal growth, vaccinations up to date" },
  ];

  const trainingProgress = [
    { id: 1, skill: "Sit", progress: 100, startDate: "2023-03-15", completedDate: "2023-04-01" },
    { id: 2, skill: "Stay", progress: 75, startDate: "2023-04-10", completedDate: null },
    { id: 3, skill: "Fetch", progress: 60, startDate: "2023-05-01", completedDate: null },
    { id: 4, skill: "Roll Over", progress: 30, startDate: "2023-05-20", completedDate: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img className="w-8 h-8 mr-2" src="/images/logo.png" alt="PetBuddy logo" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">PetBuddy</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <div className="relative">
              <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <span className="mr-2">John Doe</span>
                <img className="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pet Profile Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <img className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-6" src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80" alt="Dog profile" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Max</h2>
              <p className="text-gray-600 dark:text-gray-400">Golden Retriever • 2 years old</p>
              <div className="mt-4 flex space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">Vaccinated</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100">Neutered</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100">Microchipped</span>
              </div>
            </div>
            <div className="ml-auto mt-4 md:mt-0">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "appointments"
                  ? "border-green-500 text-green-600 dark:text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab("health")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "health"
                  ? "border-green-500 text-green-600 dark:text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Health Tracker
            </button>
            <button
              onClick={() => setActiveTab("training")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "training"
                  ? "border-green-500 text-green-600 dark:text-green-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Training
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Appointments</h2>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  New Appointment
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{appointment.date}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{appointment.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{appointment.doctor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === "Completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100"
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400">
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Health Tracker Tab */}
          {activeTab === "health" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Health Records</h2>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Add Record
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Weight</h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-500">{healthRecords[0].weight}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {healthRecords[0].date}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Height</h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-500">{healthRecords[0].height}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: {healthRecords[0].date}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Next Vaccination</h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-500">July 15, 2023</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rabies booster</p>
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Weight
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Height
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {healthRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{record.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{record.weight}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{record.height}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">{record.notes}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Training Tab */}
          {activeTab === "training" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Training Progress</h2>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Add New Skill
                </button>
              </div>

              <div className="space-y-6">
                {trainingProgress.map((skill) => (
                  <div key={skill.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{skill.skill}</h3>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Started: {skill.startDate}
                        {skill.completedDate && ` • Completed: ${skill.completedDate}`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mb-2">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full dark:bg-green-500" 
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress: {skill.progress}%</span>
                      {skill.progress < 100 && (
                        <button className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400">
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