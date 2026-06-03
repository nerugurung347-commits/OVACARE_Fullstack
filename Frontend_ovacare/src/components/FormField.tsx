import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  type: 'text' | 'email' | 'password' | 'date' | 'select';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  options?: Option[];
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  value,
  onChange,
  error,
  touched,
  placeholder,
  options,
}) => {
  const showError = touched && error;
  
  const baseInputClasses = `
    w-full px-4 py-3 rounded-lg border bg-white
    transition-all duration-200 outline-none
    ${showError 
      ? 'border-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:border-primary-500'
    }
  `;

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {type === 'select' ? (
        <select
          value={value}
          onChange={onChange}
          className={baseInputClasses}
        >
          <option value="">Select...</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseInputClasses}
        />
      )}
      
      {showError && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormField;