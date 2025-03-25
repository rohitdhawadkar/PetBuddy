import * as React from "react";

export interface FormInputProps {
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  placeholder,
  required = true,
  error,
}) => {
  return (
    <div className="mb-6">
      <label
        htmlFor={label.toLowerCase()}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={label.toLowerCase()}
        name={label.toLowerCase()}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 rounded-lg border ${
          error
            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
        } focus:outline-none focus:ring-2 transition-colors duration-200`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormInput; 