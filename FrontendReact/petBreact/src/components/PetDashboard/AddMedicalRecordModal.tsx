import React, { useState } from 'react';

interface AddMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    record_type: string;
    description: string;
    vet_id: number;
  }) => void;
  isLoading?: boolean;
}

const AddMedicalRecordModal: React.FC<AddMedicalRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [record_type, setRecordType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [vet_id, setVetId] = useState<number>(1); // Default vet ID
  const [errors, setErrors] = useState<{
    record_type?: string;
    description?: string;
  }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {
      record_type?: string;
      description?: string;
    } = {};

    if (!record_type.trim()) {
      newErrors.record_type = 'Record type is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If validation passes, save the record
    onSave({
      record_type,
      description,
      vet_id
    });

    // Reset form
    setRecordType('');
    setDescription('');
    setVetId(1);
    setErrors({});
  };

  const handleCancel = () => {
    setRecordType('');
    setDescription('');
    setVetId(1);
    setErrors({});
    onClose();
  };

  // Medical record type options
  const recordTypeOptions = [
    'Vaccination',
    'Check-up',
    'Surgery',
    'Dental',
    'Emergency',
    'Medication',
    'Parasite Control',
    'Other'
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
          <div className="bg-gradient-to-r from-purple-400 to-indigo-500 px-6 py-4 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-bold text-white">Add Medical Record</h3>
              </div>
              <p className="text-white/80 text-sm mt-1">Track your pet's medical history for better healthcare</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* Record Type */}
              <div>
                <label htmlFor="record_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Record Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="record_type"
                    value={record_type}
                    onChange={(e) => {
                      setRecordType(e.target.value);
                      setErrors({ ...errors, record_type: undefined });
                    }}
                    className={`block w-full px-4 py-3 border ${
                      errors.record_type ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                    } rounded-lg shadow-sm appearance-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="" disabled>Select record type</option>
                    {recordTypeOptions.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.record_type && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errors.record_type}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors({ ...errors, description: undefined });
                  }}
                  rows={4}
                  className={`block w-full px-4 py-3 border ${
                    errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white`}
                  placeholder="Enter details about the medical record"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Vet ID (simplified - in a real app this might be a dropdown of vets) */}
              <div>
                <label htmlFor="vet_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Veterinarian
                </label>
                <select
                  id="vet_id"
                  value={vet_id}
                  onChange={(e) => setVetId(Number(e.target.value))}
                  className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value={1}>Dr. Smith (ID: 1)</option>
                  <option value={2}>Dr. Johnson (ID: 2)</option>
                  <option value={3}>Dr. Wilson (ID: 3)</option>
                </select>
              </div>

              <div className="mt-3 text-gray-500 dark:text-gray-400 text-sm flex items-start border-t border-gray-200 dark:border-gray-700 pt-4 mt-5">
                <svg className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Keeping detailed medical records helps ensure your pet receives the best care and proper follow-ups.</span>
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
                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Record'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalRecordModal; 