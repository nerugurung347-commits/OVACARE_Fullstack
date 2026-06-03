import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto px-4">
      {/* Progress circles and lines */}
      <div className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isUpcoming = step > currentStep;
          
          return (
            <React.Fragment key={step}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center rounded-full
                    ${isCompleted ? 'bg-primary-500 w-8 h-8' : ''}
                    ${isCurrent ? 'bg-primary-600 w-10 h-10' : ''}
                    ${isUpcoming ? 'bg-gray-200 w-8 h-8' : ''}
                    transition-all duration-300
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span 
                      className={`
                        text-white font-semibold 
                        ${isCurrent ? 'text-base' : 'text-sm'}
                        ${isUpcoming ? 'text-gray-400' : ''}
                      `}
                    >
                      {step}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Connecting line (except after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-1
                    ${isCompleted ? 'bg-primary-500' : 'bg-gray-200'}
                    transition-colors duration-300
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Step label */}
      <div className="mt-3 text-sm text-gray-500 font-medium">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default ProgressBar;