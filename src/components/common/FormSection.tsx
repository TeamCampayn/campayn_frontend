import React, { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`animate-fade-in mb-8 ${className}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
