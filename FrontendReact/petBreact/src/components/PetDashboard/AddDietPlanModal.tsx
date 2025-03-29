import React, { useState } from 'react';

interface AddDietPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    plan_name: string;
    notes: string;
    status: 'Active' | 'Completed';
  }) => void;
  isLoading?: boolean;
  currentPlan?: {
    plan_name: string;
    notes: string;
    status: 'Active' | 'Completed';
  };
}

const AddDietPlanModal: React.FC<AddDietPlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  currentPlan
}) => {
  const [plan_name, setPlanName] = useState<string>(currentPlan?.plan_name || '');
  const [notes, setNotes] = useState<string>(currentPlan?.notes || '');
  const [status, setStatus] = useState<'Active' | 'Completed'>(currentPlan?.status || 'Active');
  const [errors, setErrors] = useState<{
    plan_name?: string;
    notes?: string;
  }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {
      plan_name?: string;
      notes?: string;
    } = {};

    if (!plan_name.trim()) {
      newErrors.plan_name = 'Plan name is required';
    }

    if (!notes.trim()) {
      newErrors.notes = 'Notes are required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If validation passes, save the record
    onSave({
      plan_name,
      notes,
      status
    });

    // Reset form
    setPlanName('');
    setNotes('');
    setStatus('Active');
    setErrors({});
  };

  const handleCancel = () => {
    setPlanName(currentPlan?.plan_name || '');
    setNotes(currentPlan?.notes || '');
    setStatus(currentPlan?.status || 'Active');
    setErrors({});
    onClose();
  };

  // Diet plan template options
  const dietPlanTemplates = [
    'Weight Management',
    'Puppy Growth',
    'Senior Care',
    'Allergy Management',
    'Kidney Support',
    'Diabetes Management',
    'Gastrointestinal Support',
    'Custom Plan'
  ];

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
          <div className="bg-gradient-to-r from-blue-400 to-cyan-500 px-6 py-4 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <h3 className="text-xl font-bold text-white">
                  {currentPlan ? 'Update Diet Plan' : 'Create Diet Plan'}
                </h3>
              </div>
              <p className="text-white/80 text-sm mt-1">Plan a balanced diet to keep your pet healthy</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* Plan Name */}
              <div>
                <label htmlFor="plan_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="plan_name"
                    value={plan_name}
                    onChange={(e) => {
                      setPlanName(e.target.value);
                      setErrors({ ...errors, plan_name: undefined });
                    }}
                    className={`block w-full px-4 py-3 border ${
                      errors.plan_name ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm appearance-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="" disabled>Select a diet plan</option>
                    {dietPlanTemplates.map((plan) => (
                      <option key={plan} value={plan}>{plan}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.plan_name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errors.plan_name}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setErrors({ ...errors, notes: undefined });
                  }}
                  rows={4}
                  className={`block w-full px-4 py-3 border ${
                    errors.notes ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Enter detailed diet instructions, feeding times, and any special considerations"
                />
                {errors.notes && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errors.notes}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="status-active"
                      type="radio"
                      name="status"
                      value="Active"
                      checked={status === 'Active'}
                      onChange={() => setStatus('Active')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="status-completed"
                      type="radio"
                      name="status"
                      value="Completed"
                      checked={status === 'Completed'}
                      onChange={() => setStatus('Completed')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="status-completed" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Completed
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-gray-500 dark:text-gray-400 text-sm flex items-start border-t border-gray-200 dark:border-gray-700 pt-4 mt-5">
                <svg className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Consistent feeding schedules and proper nutrition are key to your pet's overall health and wellbeing.</span>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 pt-5">
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
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : currentPlan ? (
                  'Update Plan'
                ) : (
                  'Save Plan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDietPlanModal; 