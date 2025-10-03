import React from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const AuthInput: React.FC<AuthInputProps> = ({ id, label, icon, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500">{icon}</span>
        </div>
        <input
          id={id}
          className="w-full rounded-md border border-gray-600 bg-gray-900/50 py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:border-lime-500 focus:outline-none focus:ring-lime-500 sm:text-sm"
          {...props}
        />
      </div>
    </div>
  );
};
